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

const getGame = async (gameid: any, response: any) => {
    try {
        const { username, password } = gameid;
        const res = await pool.query('SELECT * FROM "users" WHERE user_name = $1 AND password = $2', [username, password]);

        if (res.rows.length === 1) response.status(200).json(res.rows[0]);
        else response.status(401).json("Not Found");
    } catch (err) { 
        response.status(401).json("Not Found");
        console.log(err);
    }
};

const login = express.Router();
login.use(express.json());

login.get("/:username/:password", (req, res) => {
    console.log(req.params);
    const { username, password } = req.params;
    getGame({ ...req.params }, res);
});

export default login;
