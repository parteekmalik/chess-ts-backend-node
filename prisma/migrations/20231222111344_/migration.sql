/*
  Warnings:

  - You are about to drop the column `movesData` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "movesData",
ADD COLUMN     "moves" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "time" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
