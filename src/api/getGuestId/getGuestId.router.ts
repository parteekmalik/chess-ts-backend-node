import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getGuestId = express.Router();
getGuestId.use(express.json());

getGuestId.get("/", async (req, res) => {
    const guestCount = await prisma.gest_users.count();
    const guestId = `Guest${guestCount + 1}`;
    prisma.gest_users.create({
        data: {
            user_name: guestId,
        },
    });
    console.info("asigned guest id - >", guestId);
    res.status(200).send(guestId);
});

export default getGuestId;
