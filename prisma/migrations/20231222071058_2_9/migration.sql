/*
  Warnings:

  - You are about to drop the column `game_type` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `players` on the `match` table. All the data in the column will be lost.
  - Added the required column `b` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseTime` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ncrementTime` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `w` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "game_type",
DROP COLUMN "players",
ADD COLUMN     "b" INTEGER NOT NULL,
ADD COLUMN     "baseTime" INTEGER NOT NULL,
ADD COLUMN     "ncrementTime" INTEGER NOT NULL,
ADD COLUMN     "w" INTEGER NOT NULL;
