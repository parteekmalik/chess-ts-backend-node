import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg } from "../../Utils";
import { Chess } from "chess.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getpuzzles = express.Router();
getpuzzles.use(express.json());

const ratingsteps: number[] = Array.from({ length: 57 }, (_, index) => 400 + index * 50);
let totalPuzzlesArrayId: number[][];
(async () => {
    totalPuzzlesArrayId = await Promise.all(
        ratingsteps.map(async (rating) => {
            const result = await prisma.puzzles.findMany({
                where: {
                    rating: {
                        gt: rating - 25,
                        lt: rating + 25,
                    },
                },
                select: {
                    id: true,
                },
            });
            return result.map((d) => d.id as number);
        })
    );
    console.log("totalPuzzles loaded ");
})();

getpuzzles.get("/", async (req, res) => {
    let puzzleList: any = await Promise.all(
        totalPuzzlesArrayId.map(async (data) => {
            const randomId = data[Math.floor(Math.random() * data.length)];
            const puzzle = await prisma.puzzles.findMany({
                where: {
                    id: randomId,
                },
            });
            return puzzle;
        })
    );
    const ans = puzzleList.map((puzzle: any) => {
        const game = new Chess(puzzle.fen);
        puzzle.moves.split(" ").map((move: string) => {
            const payload = { from: move.substring(0, 2), to: move.substring(2, 4), promotion: move[4] };
            game.move(payload);
        });

        return { ...puzzle, moves: game.history(), themes: puzzle.themes.split(" "), opening_tags: puzzle.opening_tags.split(" ") };
    });
    res.status(200).json(ans);
});

export default getpuzzles;
