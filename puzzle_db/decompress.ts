const fs = require("fs");
const { ZSTDDecompress } = require("simple-zstd");
import { promisify } from "util";
const pipeline = promisify(require("stream").pipeline);

export const decompressFile = async (filename: string, writeto: string): Promise<void> => {
    if (fs.existsSync(writeto)) {
        console.error("Aleady decompressed");
        return;
    }

    return new Promise(async (resolve, reject) => {
        try {
            if (fs.existsSync(writeto)) {
                console.error("Already decompressed");
                resolve();
                return;
            }

            console.log("Decompressing ->", filename);

            await pipeline(fs.createReadStream(filename), ZSTDDecompress(), fs.createWriteStream(writeto));

            console.log("Copy Complete!");
            resolve();
        } catch (err) {
            console.error("Error:", err);
            reject(err);
        }
    });
};
