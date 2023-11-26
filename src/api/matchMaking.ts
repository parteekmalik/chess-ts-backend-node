import moment from "moment";
import { Pool } from "pg";
import { poolConfg } from "../Utils";

const pool = new Pool(poolConfg);

const getMatchReq = ' FROM "watingplayer" WHERE basetime = $1 AND incrementtime = $2';
const types = [
    [60000 * 10, 0],
    [60000 * 5, 0],
];
const createMatch = 'INSERT INTO "match" ( started_at, players, game_type, time) VALUES ($1, $2, $3, $4) RETURNING *';
console.log("matchMakingServer Running");
type Tquerry = "INSERT" | "UPDATE" | "DELETE" | "SELECT *" | "SELECT";
export const createQuerry = (type: Tquerry, db: string, data: Object, where?: Object): string => {
    const select_delete = (ans: string, data: Object, seprate: string, prev: number) => {
        Object.keys(data).map((key, i) => {
            ans += key + " = $" + (i + 1 + prev) + seprate + " ";
        });
        return ans.slice(0, -1 * (seprate.length + 1)) + " ";
    };
    const insert = (ans: string, data: Object) => {
        ans = "( ";
        Object.keys(data).map((key) => {
            ans += key + ", ";
        });
        ans = ans.slice(0, -2);
        ans += ") VALUES ( ";
        Object.keys(data).map((_, i) => {
            ans += "$" + (i + 1) + ", ";
        });
        return ans.slice(0, -2) + ") RETURNING *";
    };
    const switches = (type: Tquerry): string => {
        switch (type) {
            case "SELECT *":
                return type + " " + 'FROM "' + db + '" WHERE ' + select_delete("", data, " AND", 0);
            case "DELETE":
                return type + " " + 'FROM "' + db + '" WHERE ' + select_delete("", data, " AND", 0);
            case "INSERT":
                return type + " " + 'INTO "' + db + '" ' + insert("", data);
            case "UPDATE":
                let ans = type + " " + '"' + db + '" SET ' + select_delete("", data, ",", 0);
                if (where) return select_delete(ans + "WHERE ", where, " AND", Object.keys(data).length);
            default:
                return "";
        }
    };
    // console.log("querry -> ", switches(type));
    return switches(type);
};
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
        // console.log("matchMakingServer loop ->");
        let players = (await pool.query(createQuerry("SELECT *", "watingplayer", { basetime: payload[0], incrementtime: payload[1] }), payload)).rows;
        // console.info("select playerswaiting ->", players);

        for (let i = 0; i < Math.floor(players.length / 2) * 2; i += 2) {
            console.log("i -> ", i);
            const time = moment().toDate();
            let res = await pool.query(createMatch, [
                time,
                { w: players[i].userid, b: players[i + 1].userid },
                { baseTime: payload[0], incrementTime: payload[1] },
                [time],
            ]);
            // console.info("inserted new math -> ", res.rows);
            await pool.query(createQuerry("DELETE", "watingplayer", { userid: res.rows[0].players.w }), [res.rows[0].players.w]);
            await pool.query(createQuerry("DELETE", "watingplayer", { userid: res.rows[0].players.b }), [res.rows[0].players.b]);
            // console.info("delete matchMakingReq res ->");

            await pool.query(createQuerry("UPDATE", "profile", { live_match: res.rows[0].match_id }, { user_id: res.rows[0].players.w }), [
                res.rows[0].match_id,
                res.rows[0].players.w,
            ]);
            await pool.query(createQuerry("UPDATE", "profile", { live_match: res.rows[0].match_id }, { user_id: res.rows[0].players.b }), [
                res.rows[0].match_id,
                res.rows[0].players.b,
            ]);
            // console.info("profile update with live_match -> ", res.rows);
        }
    });
};

setInterval(main, 2000);
// test();
