/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `puzzles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "puzzles_PuzzleId_key";

-- AlterTable
ALTER TABLE "puzzles" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "puzzles_id_key" ON "puzzles"("id");
