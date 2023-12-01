import { Pool } from "pg";
import { createQuerry, poolConfg } from "../Utils";

const pool = new Pool(poolConfg);
const get = async (q: string, data: any[]) => {
    const res = (await pool.query(q, data)).rows;
    console.log(res);
};
get('SELECT * FROM "puzzles" WHERE themes LIKE $1 LIMIT 2', ["%promotion%"]);
