import * as fs from "fs";
import csv from "csv-parser"; // Change the import statement
import { any } from "zod";
import { Chess } from "chess.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type CsvRow = {
    fen: string;
    moves: string[];
    rating: number;
    ratingDeviation: number;
    themes: string;
    openingTags: string;
};

const parseCsvFile = (filePath: string): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        const results: any[] = [];
        let count = await prisma.puzzles.count();
        console.log(count);
        if (count > 0) {
            console.log("puzzle db already populated");
            resolve([]);
        } else {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", async (data: any) => {
                    const game = new Chess(data.FEN);
                    data.Moves.split(" ").map((move: string) => {
                        const payload = { from: move.substring(0, 2), to: move.substring(2, 4), promotion: move[4] };
                        game.move(payload);
                    });
                    const res = {
                        moves: game.history(),
                        fen: data.FEN,
                        openingTags: data.OpeningTags.split(" "),
                        themes: data.Themes.split(" "),
                        rating: Number(data.Rating),
                        ratingDeviation: Number(data.RatingDeviation),
                    };
                    await prisma.puzzles.create({
                        data: res,
                    });
                    console.log(count++);
                })
                .on("end", () => {
                    // All rows processed

                    resolve(results);
                })
                .on("error", (error: any) => {
                    // Error handling
                    reject(error);
                });
        }
    });
};

export const getData = async (csvFilePath: string): Promise<CsvRow[]> => {
    try {
        const data: CsvRow[] = await parseCsvFile(csvFilePath);
        console.log("Parsed CSV data:", data);
        return data;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        throw error;
    }
};
