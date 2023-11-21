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

const createMatchQuerry = 'INSERT INTO "match" ( started_at, players, game_type, time) VALUES ($1, $2, $3, $4) RETURNING *';

const getGame = async (game: { white: any; black: string; gameType: any; createdAt: Date; time: Date[] }) => {
    try {
        const { createdAt, white, black, gameType, time } = game;
        const res = await pool.query(createMatchQuerry, [createdAt, { w: white, b: black }, gameType, time]);

        return res.rows[0];
    } catch (err) {
        // response.status(401).json(err);
        console.log(err);
        return err;
    }
};

New.post("/", (req, res) => {
    console.log(req.body);
    const gameid = 12345;
    const curTime = moment().toDate();
    const payload = { createdAt: curTime, time: [curTime], white: req.body.userid, black: "2", gameType: req.body.gameType };
    getGame(payload).then((data) => {
        res.status(200).json(data);
        console.log("then -> ", data);
    });
});

export default New;
