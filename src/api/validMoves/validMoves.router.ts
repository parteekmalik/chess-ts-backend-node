import express from 'express';
// import findValidMoves from 'findValidMoves';
import { findValidMoves } from 'chess-validmoves';

const validmoves = express.Router();
validmoves.use(express.json());

validmoves.get('/', (req, res) => {
  res.send("only post request!!");
});
validmoves.post("/", (req, res) => {
  res.status(200);
  res.json(findValidMoves(req.body));
});

export default validmoves;
