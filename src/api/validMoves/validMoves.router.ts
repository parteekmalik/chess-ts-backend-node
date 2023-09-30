import express from 'express';
import findValidMoves from './components/ValidMovesLogic/findValidMoves';
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
