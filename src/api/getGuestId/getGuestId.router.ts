import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";

const pool = new Pool(poolConfg);

const getGuestId = express.Router();
getGuestId.use(express.json());

getGuestId.get("/", async (req, res) => {
    const guestCount = Number((await pool.query('SELECT COUNT(*) FROM "gest_users"')).rows[0].count);
    const guestId = `Guest${guestCount + 1}`;
    pool.query(createQuerry("INSERT", "gest_users", { user_name: guestId }), [guestId]);
    console.info("asigned guest id - >",guestId);
    res.status(200).send(guestId); 
});

export default getGuestId;