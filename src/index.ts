// import express from "express";
// import live from "./api/validMoves/validMoves.router";
// import cors from "cors"

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));
// const port = process.env.PORT || 5000;

// app.use('/chess/live',live);

// app.listen(port, () => {
//   console.log(`Listening: http://localhost:${port}`);
// });

// app.get("/", (req, res) => {
//   res.send("you are on home page!");
// });

// Import express, http and socket.io

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
import { Chess, PieceSymbol } from "chess.js";
import moment from "moment";

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

let useridwithsocket: { [key: string]: string } = {};
let socketidtouserandmatchid: { [key: string]: { userid: string; matchid: string } } = {};

let games: {
    [key: string]: {
        players: { [key: string]: string };
        game: Chess;
        time: Date[];
        startedAt: Date;
        stats: { isover: boolean; reason: string; winner: string };
    };
} = {
    "12345": {
        players: { w: "1", b: "2" },
        startedAt: moment().toDate(),
        game: new Chess(),
        time: [moment().toDate()],
        stats: {
            isover: false,
            winner: "still playing",
            reason: "",
        },
    },
};

// Listen for socket connections
io.on("connection", (socket: any) => {
    console.log("A user connected");
    console.log("socket id ->  ", socket.id);

    // Listen for the "message" event and broadcast it to other sockets
    socket.on("message", (msg: any) => {
        const { from, to } = msg;
        console.log("Message received from : " + socket.id + " -> " + JSON.stringify(msg, null, 2));
        const { userid, matchid } = socketidtouserandmatchid[socket.id];
        console.log(userid, matchid);
        const { players, game } = games[matchid];
        console.log(game.turn());
        console.log(players[game.turn()], userid);
        if (players[game.turn()] === userid) {
            const curTime = moment().toDate();
            try {
                game.move({ from, to });
                games[matchid].time.push(curTime);
                const payload = { move: game.history(), time: games[matchid].time };
                if (game.isDraw() || game.isCheckmate()) {
                    games[matchid].stats = game.isDraw()
                        ? { isover: true, winner: "draw", reason: "repetation" }
                        : { isover: true, winner: game.history().length % 2 == 1 ? "w" : "b", reason: "checkmate" };
                    io.to("12345").emit("message-rcv", {
                        ...payload,
                        stats: games[matchid].stats,
                    });
                } else {
                    io.to("12345").emit("message-rcv", payload);
                }
            } catch {
                try {
                    game.move({ from, to, promotion: "q" as PieceSymbol });

                    games[matchid].time.push(curTime);
                    io.to("12345").emit("message-rcv", {
                        move: game.history(),
                        time: games[matchid].time,
                    });
                } catch {
                    console.log("wrong move");
                }
            }
        }
    });
    socket.on("connectwithuserid", (data: any) => {
        console.log("connectwithuserid", data);

        const { userid, matchid } = data;
        useridwithsocket[userid] = socket.id;
        socketidtouserandmatchid[socket.id] = { userid, matchid };
        io.in(socket.id).socketsJoin(matchid);
        const curGame = games[matchid];
        io.to(socket.id).emit("initialize-prev-moves", {
            history: curGame.game.history(),
            moveTime: [...curGame.time],
            stats: curGame.stats,
        });
        console.log("initialize-prev-moves");
    });

    // Listen for the "disconnect" event and log it
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Serve static files from the public folder
app.use(express.static("public"));

// Start the server on port 3001
server.listen(3001, () => {
    console.log("Server listening on port 3001");
});

// const randomMove = () => {
//   if (moveundone.length) return;
//   const newgame = _.cloneDeep(game);
//   if (!newgame.isGameOver()) {
//     const moves = newgame.moves();
//     const move = moves[Math.floor(Math.random() * moves.length)];
//     newgame.move(move);
//     setGame(newgame);
//   }
// };
