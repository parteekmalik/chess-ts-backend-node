/*
  Warnings:

  - You are about to drop the column `black` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `white` on the `match` table. All the data in the column will be lost.
  - Added the required column `players` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "black",
DROP COLUMN "white",
ADD COLUMN     "players" JSONB NOT NULL;
