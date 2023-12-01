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
export const createQuerry = (type: Tquerry, db: string, data: Object, where?: Object, returning?: boolean): string => {
    const select_delete = (ans: string, data: Object, seprate: string, prev: number) => {
        Object.keys(data).map((key, i) => {
            ans += key + " = $" + (i + 1 + prev) + seprate + " ";
        });
        return ans.slice(0, -1 * (seprate.length + 1)) + " ";
    };
    const insert = (ans: string, data: Object) => {
        ans = "( ";
        Object.keys(data).map((key) => {
            ans += key + ", ";
        });
        ans = ans.slice(0, -2);
        ans += ") VALUES ( ";
        Object.keys(data).map((_, i) => {
            ans += "$" + (i + 1) + ", ";
        });
        ans = ans.slice(0, -2) + ") " + (returning === undefined ? "RETURNING *" : returning === true ? "RETURNING *" : "");
        return ans;
    };
    const switches = (type: Tquerry): string => {
        switch (type) {
            case "SELECT *":
                return type + " " + 'FROM "' + db + '" WHERE ' + select_delete("", data, " AND", 0);
            case "DELETE":
                return type + " " + 'FROM "' + db + '" WHERE ' + select_delete("", data, " AND", 0);
            case "INSERT":
                return type + " " + 'INTO "' + db + '" ' + insert("", data);
            case "UPDATE":
                let ans = type + " " + '"' + db + '" SET ' + select_delete("", data, ",", 0);
                if (where) return select_delete(ans + "WHERE ", where, " AND", Object.keys(data).length);
            default:
                return "";
        }
    };
    // console.log("querry -> ", switches(type));
    return switches(type) + ';';
};
export type Tquerry = "INSERT" | "UPDATE" | "DELETE" | "SELECT *" | "SELECT";
