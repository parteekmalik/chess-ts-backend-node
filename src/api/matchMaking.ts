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
    console.log(createQuerry("UPDATE", "profile", { live_match: "1234" }, { userId: "1" }));
};
const main = () => {
    types.map(async (payload) => {
        try {
            let players = await prisma.watingplayer.findMany({
                where: {
                    baseTime: payload[0],
                    incrementTime: payload[1],
                    matchId: -1,
                },
            });

            // console.info("select playerswaiting ->", players);

            for (let i = 0; i < Math.floor(players.length / 2) * 2; i += 2) {
                console.log("i -> ", i);
                const time = moment().toDate();
                console.info(players[i].isGuest, players[i + 1].isGuest, players[i].isGuest !== players[i + 1].isGuest);
                if (players[i].isGuest !== players[i + 1].isGuest) continue;

                let res = await prisma.match.create({
                    data: {
                        startedAt: time,
                        whiteId: players[i].userId,
                        blackId: players[i + 1].userId,
                        baseTime: payload[0],
                        incrementTime: payload[1],
                    },
                });
                console.info("inserted new math -> ", res);

                await prisma.watingplayer.update({
                    where: {
                        userId: res.whiteId,
                    },
                    data: {
                        matchId: res.matchId,
                    },
                });
                await prisma.watingplayer.update({
                    where: {
                        userId: res.blackId,
                    },
                    data: {
                        matchId: res.matchId,
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
