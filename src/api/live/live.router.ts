import { Chess } from "chess.js";
import moment from "moment";
import express from "express";
import { Pool } from "pg";
import { prisma } from "../../Utils";
const path = require("path");


const getGame = async (gameid: string, response: any) => {
    try {
        // const res = await pool.query('SELECT * FROM "Match" WHERE id = $1', [gameid]);
        const res = await prisma.match.findFirst({
            where: {
                matchId: Number(gameid),
            },
        });

        if (res) response.status(200).json(res);
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
