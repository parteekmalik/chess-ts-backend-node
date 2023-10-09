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

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

let useridwithsocket: { [key: string]: string } = {};
let socketidtouserandgameid: { [key: string]: { userid: string; gameid: string } } = {};

let games: { [key: string]: { players: { [key: string]: string }; game: Chess } } = { "12345": { players: { w: "1", b: "2" }, game: new Chess() } };

// Listen for socket connections
io.on("connection", (socket: any) => {
    console.log("A user connected");
    console.log("socket id ->  ", socket.id);

    // Listen for the "message" event and broadcast it to other sockets
    socket.on("message", (msg: any) => {
        const { from, to } = msg;
        console.log("Message received from : " + socket.id + " -> " + from + to);
        const { userid, gameid } = socketidtouserandgameid[socket.id];
        console.log(userid, gameid);
        const { players, game } = games[gameid];
        console.log(game.turn());
        console.log(players[game.turn()], userid);
        if (players[game.turn()] === userid) {
            try {
                game.move({ from, to });
                io.to("12345").emit("message-rcv", game.history()[game.history().length - 1]);
            } catch {
                try {
                    game.move({ from, to, promotion: "q" as PieceSymbol });
                    io.to("12345").emit("message-rcv", game.history()[game.history().length - 1]);
                } catch {
                    console.log("wrong move");
                } 
            }
        }
    });
    socket.on("connectwithuserid", (data: any) => {
        const { userid } = data;
        useridwithsocket[userid] = socket.id; 
        socketidtouserandgameid[socket.id] = { userid, gameid: data.gameid }; 
        io.in(socket.id).socketsJoin(data.gameid);
        console.log(userid);
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
