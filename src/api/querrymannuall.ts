import { Pool } from "pg";
import { createQuerry, poolConfg } from "../Utils";

const pool = new Pool(poolConfg);
const get = async (q: string, data?: any[]) => {
    const res = (await pool.query(q, data)).rows;
    console.log(res);
};
// get('SELECT * FROM "puzzles" WHERE themes LIKE $1 LIMIT 2', ["%promotion%"]);
// highest rating 3326 minimum 399
get('SELECT * FROM "puzzles" WHERE rating < $1 LIMIT 1', [380]);

// get('ALTER TABLE "puzzles" ADD COLUMN new_rating_deviation INTEGER;');
// get('UPDATE "puzzles" SET new_rating_deviation = CAST(rating_deviation AS INTEGER);');
// get('SELECT * FROM "puzzles" LIMIT 1;');
// get('ALTER TABLE "puzzles" DROP COLUMN new_rating_deviation;');
// get('ALTER TABLE "puzzles" RENAME COLUMN new_rating_deviation TO rating_deviation;');
