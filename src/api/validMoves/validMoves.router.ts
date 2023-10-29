import express from "express";
import { Chess, PieceSymbol } from "chess.js";

const validMovesR = express.Router();
validMovesR.use(express.json());

let chesMatches: { [key: string]: Chess } = { "123": new Chess() };

validMovesR.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log("get",id);
  res.status(200);
  res.json(chesMatches[id].history());
});
validMovesR.post("/:id", (req, res) => {
  const { id } = req.params;
  const { from, to } = req.body;
  console.log(from, to);
  let game: Chess = chesMatches[id];
  try {
    game.move({ from, to });
    res.status(200).json({ error: "piece moved" });
  } catch {
    try {
      game.move({ from, to, promotion: "q" as PieceSymbol });
      res.status(200).json({ error: "piece moved" });
    } catch {
      res.status(200).json({ error: "Bad Request - Missing or invalid data" });
    }
  }
});

export default validMovesR;
