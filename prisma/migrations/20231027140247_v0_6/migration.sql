/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `movesHistory` on the `Match` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "createdAt",
DROP COLUMN "movesHistory",
ADD COLUMN     "created_at" TEXT NOT NULL,
ADD COLUMN     "moves_history" TEXT[];
