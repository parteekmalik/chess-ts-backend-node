import axios from "axios";
import * as fs from "fs";
import * as path from "path";

async function downloadFile(url: string, filename: string): Promise<void> {
    const filePath = path.join(__dirname, filename);

    try {
        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            console.log(`File already exists: ${filePath}`);
            return;
        }

        const response = await axios.get(url, { responseType: "arraybuffer" });

        // Save the buffer to a file
        fs.writeFileSync(filePath, Buffer.from(response.data));

        console.log(`File downloaded successfully: ${filePath}`);
    } catch (error) {
        console.error("Error downloading file:", error instanceof Error ? error.message : error);
    }
}

// Example usage
export const fileUrl = "https://database.lichess.org/lichess_db_puzzle.csv.zst";
export const fileName = "lichess_db_puzzle.csv.zst";

// Use an async function to use await
async function download_puzzle() {
    await downloadFile(fileUrl, fileName);
}

export { download_puzzle };
