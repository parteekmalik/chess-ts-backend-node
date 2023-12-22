import { Chess, DEFAULT_POSITION, PieceSymbol } from "chess.js";
import { Server as HttpServer } from "http";
import { lastIndexOf } from "lodash";
import moment from "moment";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";
import { getLastElement, poolConfg } from "../Utils";
import { Pool } from "pg";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    /** Master list of all connected users */
    public users: { [uid: string]: string };
    /** Master list of all matches */
    getMatch = async (payload: { match_id: string }) => {
        try {
            const { match_id } = payload;
            const res = await prisma.match.findFirst({
                where: {
                    match_id: Number(match_id),
                },
            });

            if (res) return res;
            else console.info("Not Found");
        } catch (err) {
            console.log(err);
        }
    };
    updateMatch = async (payload: { match_id: string; position: string; move: string; time: Date }) => {
        try {
            const { match_id, position, move, time } = payload;
            const res = await prisma.match.update({
                where: {
                    match_id: Number(match_id),
                },
                data: {
                    position,
                    move_data: { push: { move, time } },
                },
            });

            console.info("updateMatch ->", res);
        } catch (err) {
            console.log(err);
        }
    };
    /**  */
    public socketidtouserandmatchid: { [sockekid: string]: { uid: string; matchid: string } } = {};

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: "*",
            },
        });

        this.io.on("connect", this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        console.info("Message received from " + socket.id);

        socket.on("move_sent", (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            OnRecieveMove(payload);
        });

        socket.on("handshake", (payload: { uid: string; matchid: string }) => {
            console.info("Handshake received from: " + socket.id);
            console.info("handshake payload ->", JSON.stringify(payload));
            OnHandshake(payload);
        });

        socket.on("disconnect", () => {
            console.info("Disconnect received from: " + socket.id);
        });
        const OnHandshake = (payload: { uid: string; matchid: string }) => {
            const { uid, matchid } = payload;
            if (!uid || !matchid) return;

            this.users[uid] = socket.id;
            this.socketidtouserandmatchid[socket.id] = { uid, matchid };
            this.io.in(socket.id).socketsJoin(matchid);

            // const curGameDetails = this.matches[matchid];
            this.getMatch({ match_id: matchid }).then((curGameDetails) => {
                console.info(curGameDetails);
                if (curGameDetails) {
                    const { baseTime, incrementTime, move_data, createdAt, reason, w, b } = curGameDetails;
                    this.SendMessage("recieved_matchdetails", socket.id, {
                        stats: reason,
                        whitePlayerId: w,
                        blackPlayerId: b,
                        gameType: { baseTime, incrementTime },
                        movesData: move_data,
                        startedAt: createdAt,
                    });
                } else
                    this.SendMessage("recieved_matchdetails", socket.id, {
                        error: "not found match",
                    });
            });
        };
        const OnRecieveMove = (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            console.info("Message received from " + socket.id);
            console.info("payload " + JSON.stringify(payload));
            // socket.emit("recieved_move", { move: payload.move, moveTime: moment().toDate() });

            const { uid, matchid } = this.socketidtouserandmatchid[socket.id];
            console.log(uid, matchid);

            const curGameDetails = this.getMatch({ match_id: matchid }).then((curGameDetails) => {
                console.log(curGameDetails);
                if (curGameDetails) {
                    const matchGame = new Chess(curGameDetails.position);

                    console.log(matchGame.turn());
                    console.log(curGameDetails[matchGame.turn()], uid);

                    if (curGameDetails[matchGame.turn()] === uid) {
                        const curTime = moment().toDate();
                        try {
                            matchGame.move(payload);
                        } catch {
                            try {
                                matchGame.move({
                                    ...(payload as { from: string; to: string; promotion?: string | undefined }),
                                    promotion: "q" as PieceSymbol,
                                });
                            } catch {
                                console.log("wrong move");
                            }
                        }
                        if (matchGame.history().length) {
                            this.updateMatch({ match_id: matchid, move: matchGame.history()[0], time: curTime, position: matchGame.fen() });
                            this.SendMessage("recieved_move", matchid, {
                                move: matchGame.history()[0],
                                time: curTime,
                            });
                        }
                    }
                }
            });
        };
    };

    GetUidFromSocketID = (id: string) => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    SendMessage = (name: string, id: string, payload?: Object) => {
        console.info("Emitting event: " + name + " to", id);
        payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name);
    };
}
