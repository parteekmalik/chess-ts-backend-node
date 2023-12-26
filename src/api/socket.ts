import { Chess, DEFAULT_POSITION, PieceSymbol } from "chess.js";
import { Server as HttpServer } from "http";
import moment from "moment";
import { Socket, Server } from "socket.io";
import { prisma } from "../Utils";


export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

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

    /** Master list of all connected users */
    public users: { [uid: string]: string };
    /** Master list of all matches */

    StartListeners = (socket: Socket) => {
        console.info("Message received from " + socket.id);

        socket.on("move_sent", (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            console.info("payload for 'move_sent' ->", payload);
            OnRecieveMove(payload);
        });

        socket.on("handshake", (payload: { uid: string; matchid: string }) => {
            console.info("Handshake received from: " + socket.id);
            console.info(" payload 'handshake' ->", JSON.stringify(payload));
            OnHandshake(payload);
        });

        socket.on("disconnect", (payload) => {
            console.info("payload 'Disconnect' : ", payload);
        });

        const OnHandshake = (payload: { uid: string; matchid: string }) => {
            const { uid, matchid } = payload;
            if (!uid || !matchid) return;

            this.users[uid] = socket.id;
            this.socketidtouserandmatchid[socket.id] = { uid, matchid };
            this.io.in(socket.id).socketsJoin(matchid);

            // const curGameDetails = this.matches[matchid];
            this.getMatch({ matchId: matchid }).then((curGameDetails) => {
                if (curGameDetails) {
                    const { baseTime, incrementTime, moves, time, startedAt, stats, whiteId, blackId } = curGameDetails;
                    const payload = {
                        stats,
                        whiteId,
                        blackId,
                        movesData: moves.map((d, i) => {
                            return { move: d, time: moment(time[i]).toDate() };
                        }),
                        startedAt: moment(startedAt).toDate(),
                        gameType: { baseTime, incrementTime },
                    };
                    this.SendMessage("recieved_matchdetails", socket.id, payload);
                } else
                    this.SendMessage("recieved_matchdetails", socket.id, {
                        error: "not found match",
                    });
            });
        };
        const OnRecieveMove = (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            const { uid, matchid } = this.socketidtouserandmatchid[socket.id];

            const curGameDetails = this.getMatch({ matchId: matchid }).then((curGameDetails) => {
                if (curGameDetails) {
                    const game = new Chess(curGameDetails.position);

                    if (curGameDetails[game.turn() === "w" ? "whiteId" : "blackId"] === uid) {
                        const curTime = moment().toDate();
                        this.tryToMakeMove(game, payload);
                        if (game.history().length) {
                            this.updateMatch({ matchId: matchid, move: game.history()[0], time: curTime, position: game.fen() });
                            this.SendMessage("recieved_move", matchid, {
                                move: game.history()[0],
                                time: curTime,
                            });
                        }
                    }
                }
            });
        };
    };
    tryToMakeMove = (game: Chess, payload: string | { from: string; to: string; promotion?: string | undefined }) => {
        try {
            game.move(payload);
        } catch {
            try {
                game.move({
                    ...(payload as { from: string; to: string; promotion?: string | undefined }),
                    promotion: "q" as PieceSymbol,
                });
            } catch {
                console.log("wrong move");
            }
        }
    };
    getMatch = async (payload: { matchId: string }) => {
        try {
            const { matchId } = payload;
            const res = await prisma.match.findFirst({
                where: {
                    matchId: Number(matchId),
                },
            });

            if (res) return res;
            else console.info("Not Found");
        } catch (err) {
            console.log(err);
        }
    };
    updateMatch = async (payload: { matchId: string; position: string; move: string; time: Date }) => {
        try {
            const { matchId, position, move, time } = payload;
            const res = await prisma.match.update({
                where: {
                    matchId: Number(matchId),
                },
                data: {
                    position,
                    moves: { push: move },
                    time: { push: time },
                },
            });

            console.info("updateMatch ->", res);
        } catch (err) {
            console.log(err);
        }
    };
    GetUidFromSocketID = (id: string) => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    SendMessage = (name: string, id: string, payload?: Object) => {
        console.info("Emitting event: " + name + " to", id);
        payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name);
    };
}
