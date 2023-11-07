import express from "express";
import moment from "moment";

const getTime = express.Router();
getTime.use(express.json());

getTime.get("/", (req, res) => {
    console.log(req.body);
    res.status(200);
    res.send(moment().toDate());
});

export default getTime;
