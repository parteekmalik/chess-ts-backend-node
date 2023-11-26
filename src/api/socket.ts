import { Chess, DEFAULT_POSITION, PieceSymbol } from "chess.js";
import { Server as HttpServer } from "http";
import { lastIndexOf } from "lodash";
import moment from "moment";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";
import { getLastElement, poolConfg } from "../Utils";
import { Pool } from "pg";

const pool = new Pool(poolConfg);

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    /** Master list of all connected users */
    public users: { [uid: string]: string };
    /** Master list of all matches */
    getMatch = async (payload: { match_id: string }) => {
        try {
            const { match_id } = payload;
            const res = await pool.query('SELECT * FROM "match" WHERE match_id = $1', [Number(match_id)]);

            if (res.rows.length === 1) return res.rows[0];
            else console.info("Not Found");
        } catch (err) {
            console.log(err);
        }
    };
    updateMatch = async (payload: { match_id: string; position: string; move: string; time: Date }) => {
        try {
            const { match_id, position, move, time } = payload;
            const res = await pool.query(
                'UPDATE "match" SET ' + "position = $2, history = array_append(history,$3), time = array_append(time,$4)" + " WHERE match_id = $1",
                [Number(match_id), position, move, time]
            );
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
            this.getMatch({ match_id: matchid }).then(
                (curGameDetails: {
                    reason: string;
                    players: { [uid: string]: string };
                    game_type: { baseTime: number; incrementTime: number };
                    started_at: string;
                    time: string[];
                    history: string[];
                }) => {
                    console.info(curGameDetails);
                    this.SendMessage("recieved_matchdetails", socket.id, {
                        stats: curGameDetails.reason,
                        whitePlayerId: curGameDetails.players["w"],
                        blackPlayerId: curGameDetails.players["b"],
                        gameType: curGameDetails.game_type,
                        moves: curGameDetails.history,
                        movesTime: curGameDetails.time,
                        startedAt: curGameDetails.started_at,
                    });
                }
            );
        };
        const OnRecieveMove = (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            console.info("Message received from " + socket.id);
            console.info("payload " + JSON.stringify(payload));
            // socket.emit("recieved_move", { move: payload.move, moveTime: moment().toDate() });

            const { uid, matchid } = this.socketidtouserandmatchid[socket.id];
            console.log(uid, matchid);

            const curGameDetails = this.getMatch({ match_id: matchid }).then((curGameDetails) => {
                console.log(curGameDetails);
                const matchGame = new Chess(curGameDetails.position);

                console.log(matchGame.turn());
                console.log(curGameDetails.players[matchGame.turn()], uid);

                if (curGameDetails.players[matchGame.turn()] === uid) {
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
