import express from "express";
import moment from "moment";

const getTime = express.Router();
getTime.use(express.json());

getTime.get("/", (req, res) => {
    console.log(req.ip);
    res.status(200);
    res.json(moment().toDate());
});

export default getTime;
 