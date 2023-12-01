/*
  Warnings:

  - You are about to drop the column `FEN` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `GameUrl` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `Moves` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `NbPlays` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `OpeningTags` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `Popularity` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `PuzzleId` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `Rating` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `RatingDeviation` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `Themes` on the `puzzles` table. All the data in the column will be lost.
  - Added the required column `fen` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_url` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moves` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_plays` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening_tags` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puzzle_id` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating_deviation` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themes` to the `puzzles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "puzzles" DROP COLUMN "FEN",
DROP COLUMN "GameUrl",
DROP COLUMN "Moves",
DROP COLUMN "NbPlays",
DROP COLUMN "OpeningTags",
DROP COLUMN "Popularity",
DROP COLUMN "PuzzleId",
DROP COLUMN "Rating",
DROP COLUMN "RatingDeviation",
DROP COLUMN "Themes",
ADD COLUMN     "fen" TEXT NOT NULL,
ADD COLUMN     "game_url" TEXT NOT NULL,
ADD COLUMN     "moves" TEXT NOT NULL,
ADD COLUMN     "nb_plays" TEXT NOT NULL,
ADD COLUMN     "opening_tags" TEXT NOT NULL,
ADD COLUMN     "popularity" TEXT NOT NULL,
ADD COLUMN     "puzzle_id" TEXT NOT NULL,
ADD COLUMN     "rating" TEXT NOT NULL,
ADD COLUMN     "rating_deviation" TEXT NOT NULL,
ADD COLUMN     "themes" TEXT NOT NULL;
