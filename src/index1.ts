import getTime from "./api/getTime/getTime.router";

const express = require("express");
const http = require("http");
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));

const server = http.createServer(app);

app.use("/getTime", getTime);

server.listen(3002, () => {
    console.log("Server listening on port 3002");
});
