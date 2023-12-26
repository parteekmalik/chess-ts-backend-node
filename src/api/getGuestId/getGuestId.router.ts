import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg, prisma } from "../../Utils";

const getGuestId = express.Router();
getGuestId.use(express.json());

getGuestId.get("/", async (req, res) => {
    const guestCount = await prisma.gest_users.count();
    const guestId = `Guest${guestCount + 1}`;
    await prisma.gest_users.create({
        data: {
            userName: guestId,
        },
    });
    console.info("asigned guest id - >", guestId);
    res.status(200).send(guestId);
});

export default getGuestId;
