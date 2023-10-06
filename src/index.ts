import express from "express";
import validmove from "./api/validMoves/validMoves.router";
import cors from "cors"

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));
const port = process.env.PORT || 5000;

app.use('/chess/validmoves',validmove);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("you are on home page!");
});

