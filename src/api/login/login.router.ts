import { Chess } from "chess.js";
import moment from "moment";
import express from "express";
import { prisma } from "../../Utils";


const getGame = async (gameid: { username: string; password: string }, response: any) => {
    try {
        const { username, password } = gameid;
        // const res = await pool.query('SELECT * FROM "users" WHERE userName = $1 AND password = $2', [username , password ]);
        const res = await prisma.users.findFirst({
            where: {
                userName: username,
                password: password,
            },
        });

        if (res) response.status(200).json(res);
        else response.status(401).json("Not Found");
    } catch (err) {
        response.status(401).json("Not Found");
        console.log(err);
    }
};

const login = express.Router();
login.use(express.json());

login.get("/:username/:password", (req, res) => {
    console.log(req.params);
    const { username, password } = req.params;
    getGame(req.params, res);
});

export default login;
