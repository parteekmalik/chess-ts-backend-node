import { Chess } from "chess.js";
import moment from "moment";
import express from "express";
import { Pool } from "pg";
const path = require("path");
import { v4 as uuidv4 } from "uuid";

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

const getGame = async (gameid: { username: string; password: string }, response: any) => {
    try {
        const { username, password } = gameid;
        const res = await pool.query('SELECT * FROM "users" WHERE user_name = $1', [username]);

        if (res.rows.length === 1) response.status(401).json("username taken");
        else {
            let res = { rows: [] };
            res = await pool.query('INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING *', [username, password]);
            response.status(200).json(res.rows);
        }
    } catch (err) {
        response.status(401).json(err);
        console.log(err);
    }
};

const register = express.Router();
register.use(express.json());

register.get("/:username/:password", (req, res) => {
    console.log(req.params);
    const { username, password } = req.params;
    getGame({ ...req.params }, res);
});

export default register;
