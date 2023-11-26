import { Chess, DEFAULT_POSITION } from "chess.js";
import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { poolConfg } from "../../Utils";
import { createQuerry } from "../matchMaking";

const pool = new Pool(poolConfg);

const New = express.Router();
New.use(express.json());

const getGame = async (game: { userid: string; gameType: { baseTime: number; incrementTime: number }; createdAt: Date }) => {
    try {
        const { userid, gameType } = game;

        let is_guest = false;
        if (userid.slice(0, 5) === "Guest") is_guest = true;
        
        const payload = { time: moment().toDate(), user_id: userid, base_time: gameType.baseTime, increment_time: gameType.incrementTime, is_guest };
        const request_id = (await pool.query(createQuerry("INSERT", "watingplayer", payload), Object.values(payload))).rows[0].request_id;
        console.info("insert waitingplayers >", request_id);

        const match_id = await new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    console.log("inside loop ->");
                    const res = (await pool.query(createQuerry("SELECT *", "watingplayer", { request_id }), [request_id])).rows[0].match_id;
                    console.log("inside loop waiting for matchmaking -> ", moment().toDate().getDate(), ", res -> ", res);

                    if (res !== -1) {
                        await pool.query(createQuerry("DELETE", "watingplayer", { request_id: request_id }), [request_id]);
                        clearInterval(intervalId); // Stop the interval
                        resolve(res); // Resolve the promise with the result
                    }
                } catch (error) {
                    console.log(error);
                }
            }, 100);
        });

        return (await pool.query(createQuerry("SELECT *", "watingplayer", { match_id }), [match_id])).rows[0];
    } catch (err) {
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
