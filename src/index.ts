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
            reason: "still playing",
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
        console.log("Message received from : " + socket.id + " -> " + from + to);
        const { userid, matchid } = socketidtouserandmatchid[socket.id];
        console.log(userid, matchid);
        const { players, game } = games[matchid];
        console.log(game.turn());
        console.log(players[game.turn()], userid);
        if (players[game.turn()] === userid) {
            try {
                game.move({ from, to });
                games[matchid].time.push(moment().toDate());
                if (game.isDraw()) {
                    games[matchid].stats = { isover: true, winner: "draw", reason: "repetation" };
                    io.to("12345").emit("game-over-byMove", {
                        move: game.history()[game.history().length - 1],
                        time: games[matchid].time[games[matchid].time.length - 1],
                        stats: games[matchid].stats,
                    });
                } else if (game.isCheckmate()) {
                    games[matchid].stats = { isover: true, winner: game.history().length % 2 == 1 ? "w" : "b", reason: "checkmate" };
                    io.to("12345").emit("game-over-byMove", {
                        move: game.history()[game.history().length - 1],
                        time: games[matchid].time[games[matchid].time.length - 1],
                        stats: games[matchid].stats,
                    });
                } else {
                    io.to("12345").emit("message-rcv", {
                        move: game.history()[game.history().length - 1],
                        time: games[matchid].time[games[matchid].time.length - 1],
                    });
                }
            } catch {
                try {
                    game.move({ from, to, promotion: "q" as PieceSymbol });
                    games[matchid].time.push(moment().toDate());
                    io.to("12345").emit("message-rcv", { move: game.history()[game.history().length - 1], time: moment().toDate() });
                } catch {
                    console.log("wrong move");
                }
            }
        }
    });
    socket.on("connectwithuserid", (data: any) => {
        const { userid, matchid } = data;
        useridwithsocket[userid] = socket.id;
        socketidtouserandmatchid[socket.id] = { userid, matchid };
        io.in(socket.id).socketsJoin(matchid);
        const curGame = games[matchid];
        io.to(socket.id).emit("initialize-prev-moves", {
            history: curGame.game.history(), 
            startedAt: curGame.startedAt,
            moveTime: [...curGame.time, moment().toDate()],
            curTime: moment().toDate(),
            stats: curGame.stats,
        });
        console.log("connectwithuserid", userid);
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
