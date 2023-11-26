const path = require("path");

export function getLastElement<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

require("dotenv").config({
    override: true,
    path: path.join(path.join(__dirname, ".."), ".env"),
});

export const poolConfg = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
};
