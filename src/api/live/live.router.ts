import { Chess } from "chess.js";
import moment from "moment";
import express from "express";
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

const getGame = async (gameid: string, response:any) => {
    try {
        const res = await pool.query('SELECT * FROM "Match" WHERE id = $1', [gameid]);

        if (res.rows.length === 1) response.status(200).json(res.rows[0]);
        else response.status(401).json("Not Found");
    } catch (err) {
        response.status(401).json("Not Found");
        console.log(err);
    }
};

const live = express.Router();
live.use(express.json());

live.get("/:gameid", (req, res) => {
    console.log(req.params);
    const { gameid } = req.params;
    getGame(gameid, res);
});

export default live;
