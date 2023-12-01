-- CreateTable
CREATE TABLE "puzzles" (
    "PuzzleId" TEXT NOT NULL,
    "FEN" TEXT NOT NULL,
    "Moves" TEXT NOT NULL,
    "Rating" INTEGER NOT NULL,
    "RatingDeviation" INTEGER NOT NULL,
    "Popularity" INTEGER NOT NULL,
    "NbPlays" INTEGER NOT NULL,
    "Themes" TEXT NOT NULL,
    "GameUrl" TEXT NOT NULL,
    "OpeningTags" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "puzzles_PuzzleId_key" ON "puzzles"("PuzzleId");
