import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../Utils";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMatchReq = ' FROM "watingplayer" WHERE basetime = $1 AND incrementtime = $2';
const types = [
    [60000 * 10, 0],
    [60000 * 5, 0],
];
const createMatch = 'INSERT INTO "match" ( started_at, players, game_type) VALUES ($1, $2, $3) RETURNING *';
console.log("matchMakingServer Running");

const test = () => {
    console.log(createQuerry("SELECT *", "watingplayer", { basetime: 60000 * 10, incrementtime: 0 }));
    console.log(createQuerry("DELETE", "watingplayer", { basetime: 60000 * 10, incrementtime: 0 }));
    console.log(
        createQuerry("INSERT", "match", {
            time: [moment().toDate()],
            started_at: moment().toDate(),
            players: { w: "1", b: "2" },
            game_type: { basetime: 60000 * 10, incrementtime: 0 },
        })
    );
    console.log(createQuerry("UPDATE", "profile", { live_match: "1234" }, { user_id: "1" }));
};
const main = () => {
    types.map(async (payload) => {
        try {
            let players = await prisma.watingplayer.findMany({
                where: {
                    base_time: payload[0],
                    increment_time: payload[1],
                    match_id: -1,
                },
            });

            // console.info("select playerswaiting ->", players);

            for (let i = 0; i < Math.floor(players.length / 2) * 2; i += 2) {
                console.log("i -> ", i);
                const time = moment().toDate();
                console.info(players[i].is_guest, players[i + 1].is_guest, players[i].is_guest !== players[i + 1].is_guest);
                if (players[i].is_guest !== players[i + 1].is_guest) continue;

                let res = await prisma.match.create({
                    data: {
                        createdAt: time,
                        w: players[i].user_id,
                        b: players[i + 1].user_id,
                        baseTime: payload[0],
                        incrementTime: payload[1],
                    },
                });
                console.info("inserted new math -> ", res);

                await prisma.watingplayer.update({
                    where: {
                        user_id: res.w,
                    },
                    data: {
                        match_id: res.match_id,
                    },
                });
                await prisma.watingplayer.update({
                    where: {
                        user_id: res.b,
                    },
                    data: {
                        match_id: res.match_id,
                    },
                });


                // console.info("watingplayer update with live_match -> ", res.rows);
            }
        } catch (err) {
            console.info(err);
        }
    });
};

setInterval(main, 2000);
// test();
