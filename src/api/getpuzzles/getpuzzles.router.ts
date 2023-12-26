import express from "express";
import moment from "moment";
import { Pool } from "pg";
import { createQuerry, poolConfg, prisma } from "../../Utils";
import { Chess } from "chess.js";



const getpuzzles = express.Router();
getpuzzles.use(express.json());

const ratingsteps: number[] = Array.from({ length: 57 }, (_, index) => 400 + index * 50);
let totalPuzzlesArrayId: number[][];
(async () => {
    console.log("loading puzzles");
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
    let puzzleList = await Promise.all(
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

    res.status(200).json(puzzleList);
});

export default getpuzzles;
