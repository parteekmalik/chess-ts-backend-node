import { Chess, PieceSymbol } from "chess.js";
import { Server as HttpServer } from "http";
import moment from "moment";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    /** Master list of all connected users */
    public users: { [uid: string]: string };
    /** Master list of all matches */
    public matches: {
        [matchid: string]: {
            players: { [uid: string]: string };
            game: Chess;
            time: number[];
            startedAt: number;
            stats: { isover: boolean; reason: string; winner: string };
            gameType: { baseTime: number; incrementTime: number };
        };
    } = {
        "12345": {
            players: { w: "1", b: "2" },
            startedAt: moment().toDate().getTime(),
            game: new Chess(),
            time: [moment().toDate().getTime()],
            stats: {
                isover: false,
                winner: "",
                reason: "",
            },
            gameType: { baseTime: 10 * 60000, incrementTime: 0 },
        },
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
            const curGame = this.matches[matchid];
            this.SendMessage("recieved_matchdetails", socket.id, {
                stats: curGame.stats,
                whitePlayerId: curGame.players["w"],
                blackPlayerId: curGame.players["b"],
                gameType: curGame.gameType,
                moves: curGame.game.history(),
                movesTime: curGame.time,
                startedAt: curGame.startedAt,
            });
        };
        const OnRecieveMove = (payload: string | { from: string; to: string; promotion?: string | undefined }) => {
            console.info("Message received from " + socket.id);
            console.info("payload " + JSON.stringify(payload));
            // socket.emit("recieved_move", { move: payload.move, moveTime: moment().toDate() });

            const { uid, matchid } = this.socketidtouserandmatchid[socket.id];
            console.log(uid, matchid);
            const curGame = this.matches[matchid];
            console.log(curGame.game.turn());
            console.log(curGame.players[curGame.game.turn()], uid);

            if (curGame.players[curGame.game.turn()] === uid) {
                const curTime = moment().toDate().getTime();
                try {
                    curGame.game.move(payload);
                    this.matches[matchid].time.push(curTime);
                    this.SendMessage("recieved_move", matchid, {
                        move: curGame.game.history()[curGame.game.history().length - 1],
                        time: curTime,
                    });
                } catch {
                    try {
                        curGame.game.move({
                            ...(payload as { from: string; to: string; promotion?: string | undefined }),
                            promotion: "q" as PieceSymbol,
                        });

                        this.matches[matchid].time.push(curTime);
                        this.SendMessage("recieved_move", matchid, {
                            move: curGame.game.history()[curGame.game.history().length - 1],
                            time: curTime,
                        });
                    } catch {
                        console.log("wrong move");
                    }
                }
            }
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
