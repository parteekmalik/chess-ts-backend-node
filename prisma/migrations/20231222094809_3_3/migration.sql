/*
  Warnings:

  - You are about to drop the column `moveData` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "moveData",
ADD COLUMN     "movesData" JSONB[] DEFAULT ARRAY[]::JSONB[];
