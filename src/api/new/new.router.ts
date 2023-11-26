import { Chess, DEFAULT_POSITION } from "chess.js";
import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { poolConfg } from "../../Utils";

const pool = new Pool(poolConfg);

const New = express.Router();
New.use(express.json());

const getMatch = 'SELECT * FROM "match" WHERE match_id = $1';
const pushMatch = 'INSERT INTO "watingplayer" (time,userid,basetime,incrementtime) VALUES ($1,$2,$3,$4) RETURNING *';
// const getUpdate = 'SELECT * FROM "watingplayer" WHERE basetime = $1 incrementtime = $2';
const getUpdate = 'SELECT * FROM "profile" WHERE user_id = $1';
const getGame = async (game: { userid: string; gameType: { baseTime: number; incrementTime: number }; createdAt: Date }) => {
    try {
        const { createdAt, userid, gameType } = game;
        // const res = await pool.query(createMatchQuerry, [createdAt, { w: white, b: black }, gameType, time]);
        // const res = await pool.query(getWatingPlayers, [gameType.baseTime, gameType.incrementTime]);
        const respo = await pool.query(pushMatch, [moment().toDate(), userid, gameType.baseTime, gameType.incrementTime]);
        console.info("insert waitingplayers >", respo.rows);
        const res = await new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    console.log("inside loop ->");
                    const res = (await pool.query(getUpdate, [userid])).rows[0].live_match;
                    console.log("inside loop waiting for matchmaking -> ", moment().toDate().getDate(), ", res -> ", res);

                    if (res !== -1) {
                        clearInterval(intervalId); // Stop the interval
                        resolve(res); // Resolve the promise with the result
                    }
                } catch (error) {
                    console.log(error);
                }
            }, 100);
        });

        return (await pool.query(getMatch, [res])).rows[0];
    } catch (err) {
        // response.status(401).json(err);
        console.log(err);
        return err;
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
