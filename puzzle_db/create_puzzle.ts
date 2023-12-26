import path from "path";
import { decompressFile } from "./decompress";
import { getData } from "./parse_csv";

const inputPath = path.join(__dirname, "lichess_db_puzzle.csv.zst");
const outputPath = path.join(__dirname, "lichess_db_puzzle.csv");

import { download_puzzle } from "./download";

const run = async () => {
    await download_puzzle();
    await decompressFile(inputPath, outputPath);
    await getData(outputPath);
};
run();
