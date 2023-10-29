import { Chess, DEFAULT_POSITION } from "chess.js";
import express from "express";
import moment from "moment";
import { Pool } from "pg";
const path = require("path");

require("dotenv").config({
    override: true,
    path: path.join(path.join(__dirname, "../../.."), ".env"),
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const New = express.Router();
New.use(express.json());

const getGame = async (
    game: {
        board: string;
        white: any;
        black: string;
        gameType: any;
        createdAt: string;
    },
    response: any
) => {
    try {
        const { createdAt, board, white, black, gameType } = game;
        const res = await pool.query("INSERT INTO \"Match\" (board, created_at, white, black, game_type) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            board,
            createdAt,
            white,
            black,
            gameType,
        ]);

        // if (res.rows.length === 1) response.status(200).json(res.rows[0]);
        // else response.status(401).json("Not Found");
        console.log(res.rows);
        response.status(200).json(res.rows);
    } catch (err) {
        response.status(401).json(err);
        console.log(err);
    }
};

New.post("/", (req, res) => {
    console.log(req.body);
    const gameid = 12345;
    const payload = { createdAt:moment().format(), board: DEFAULT_POSITION, white: req.body.userid, black: "2", gameType: req.body.gameType };
    getGame(payload, res);
    // res.status(200);
    // res.json(payload);
});

export default New;
