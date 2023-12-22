import { Chess, DEFAULT_POSITION } from "chess.js";
import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const New = express.Router();
New.use(express.json());

const getGame = async (game: { userid: string; gameType: { baseTime: number; incrementTime: number }; createdAt: Date }) => {
    try {
        const { userid, gameType } = game;

        let is_guest = false;
        if (userid.slice(0, 5) === "Guest") is_guest = true;

        // Create waiting player record
        const waitingPlayer = await prisma.watingplayer.create({
            data: {
                time: moment().toDate(),
                user_id: userid,
                base_time: gameType.baseTime,
                increment_time: gameType.incrementTime,
                is_guest,
            },
        });

        console.info("Inserted waitingplayers", waitingPlayer);

        // Wait for matchmaking and retrieve match_id
        const match_id = await new Promise<number>((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    console.log("Inside loop ->");

                    const waitingPlayerResult = await prisma.watingplayer.findFirst({
                        where: {
                            request_id: waitingPlayer.request_id,
                        },
                    });

                    console.log("Inside loop waiting for matchmaking -> ", moment().toDate().getDate(), ", res -> ", waitingPlayerResult);
                    if (waitingPlayerResult !== null) {
                        if (waitingPlayerResult?.match_id !== -1) {
                            // Delete waiting player record
                            await prisma.watingplayer.delete({
                                where: {
                                    request_id: waitingPlayer.request_id,
                                },
                            });

                            clearInterval(intervalId); // Stop the interval
                            resolve(waitingPlayerResult.match_id); // Resolve the promise with the result
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }, 100);
        });

        // Retrieve match data using match_id
        const matchData = await prisma.match.findFirst({
            where: {
                match_id: match_id,
            },
        });

        return matchData;
    } catch (err) {
        console.log(err);
    }
};

New.post("/", (req, res) => {
    console.log(req.body);
    const payload = { createdAt: moment().toDate(), userid: req.body.userid, gameType: req.body.gameType };
    getGame(payload).then((data) => {
        res.status(200).json(data);
        console.log("then -> ", data);
    });
});

export default New;
