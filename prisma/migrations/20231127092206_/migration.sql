/*
  Warnings:

  - You are about to drop the column `game_url` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `nb_plays` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `puzzle_id` on the `puzzles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "puzzles" DROP COLUMN "game_url",
DROP COLUMN "nb_plays",
DROP COLUMN "popularity",
DROP COLUMN "puzzle_id";
