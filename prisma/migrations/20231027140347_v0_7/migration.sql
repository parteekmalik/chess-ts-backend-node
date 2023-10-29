/*
  Warnings:

  - You are about to drop the column `gameType` on the `Match` table. All the data in the column will be lost.
  - Added the required column `game_type` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "gameType",
ADD COLUMN     "game_type" JSONB NOT NULL;
