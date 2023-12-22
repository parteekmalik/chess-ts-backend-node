import { Chess, DEFAULT_POSITION } from "chess.js";
import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const New = express.Router();
New.use(express.json());

const getGame = async (game: { userid: string; gameType: { baseTime: number; incrementTime: number }; startedAt: Date }) => {
    try {
        const { userid, gameType } = game;

        let isGuest = false;
        if (userid.slice(0, 5) === "Guest") isGuest = true;

        // Create waiting player record
        const waitingPlayer = await prisma.watingplayer.create({
            data: {
                time: moment().toDate(),
                userId: userid,
                baseTime: gameType.baseTime,
                incrementTime: gameType.incrementTime,
                isGuest,
            },
        });

        console.info("Inserted waitingplayers", waitingPlayer);

        // Wait for matchmaking and retrieve matchId
        const matchId = await new Promise<number>((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    console.log("Inside loop ->");

                    const waitingPlayerResult = await prisma.watingplayer.findFirst({
                        where: {
                            requestId: waitingPlayer.requestId,
                        },
                    });

                    console.log("Inside loop waiting for matchmaking -> ", moment().toDate().getDate(), ", res -> ", waitingPlayerResult);
                    if (waitingPlayerResult !== null) {
                        if (waitingPlayerResult?.matchId !== -1) {
                            // Delete waiting player record
                            await prisma.watingplayer.delete({
                                where: {
                                    requestId: waitingPlayer.requestId,
                                },
                            });

                            clearInterval(intervalId); // Stop the interval
                            resolve(waitingPlayerResult.matchId); // Resolve the promise with the result
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }, 100);
        });

        // Retrieve match data using matchId
        const matchData = await prisma.match.findFirst({
            where: {
                matchId: matchId,
            },
        });

        return matchData;
    } catch (err) {
        console.log(err);
    }
};

New.post("/", (req, res) => {
    console.log(req.body);
    const payload = { startedAt: moment().toDate(), userid: req.body.userid, gameType: req.body.gameType };
    getGame(payload).then((data) => {
        res.status(200).json(data);
        console.log("then -> ", data);
    });
});

export default New;
