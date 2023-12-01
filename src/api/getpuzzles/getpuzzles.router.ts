import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";
import { Chess } from "chess.js";

const pool = new Pool(poolConfg);

const getpuzzles = express.Router();
getpuzzles.use(express.json());

getpuzzles.get("/", async (req, res) => {
    const totalPuzzles = Number((await pool.query('SELECT COUNT(*) FROM "puzzles"')).rows[0].count);
    console.log("totalPuzzles -> ", totalPuzzles);
    const randomN = Math.floor(Math.random() * totalPuzzles);
    const puzzle = (await pool.query('SELECT * FROM "puzzles" WHERE id = $1', [randomN])).rows[0];
    console.info("puzzle sent  - >", puzzle);
    const game = new Chess(puzzle.fen);
    puzzle.moves.split(" ").map((move: string) => {
        const payload = { from: move.substring(0, 2), to: move.substring(2, 4), promotion: move[4] };
        console.log(move, payload);
        game.move(payload);
    });
    puzzle.moves = game.history();

    puzzle.themes = puzzle.themes.split(" ");
    puzzle.opening_tags = puzzle.opening_tags.split(" ");
    puzzle.rating = Number(puzzle.rating);
    puzzle.rating_deviation = Number(puzzle.rating_deviation);

    res.status(200).json(puzzle);
});

export default getpuzzles;
