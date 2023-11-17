import getTime from "./api/getTime/getTime.router";

const express = require("express");
const http = require("http");
import cors from 'cors';
import New from "./api/new/new.router";
import live from "./api/live/live.router";
import login from "./api/login/login.router";
import register from "./api/register/register.router";

const app = express();

app.use(cors({ origin: '*' }));

const server = http.createServer(app);

app.use("/new",New);

app.use("/live",live);

app.use("/login",login);

app.use("/register",register);

server.listen(3002, () => {
    console.log("Server listening on port 3002");
});
