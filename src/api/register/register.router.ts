import { Chess } from "chess.js";
import moment from "moment";
import express from "express";
import { Pool } from "pg";
import { prisma } from "../../Utils";
const path = require("path");


const getGame = async (gameid: { username: string; password: string }, response: any) => {
    try {
        const { username, password } = gameid;
        const res = await prisma.users.findFirst({
            where: {
                userName: username,
            },
        });

        if (res) response.status(401).json("username taken");
        else {
            const res = await prisma.users.create({
                data: {
                    userName: username,
                    password: password,
                },
            });
            response.status(200).json(res);
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
