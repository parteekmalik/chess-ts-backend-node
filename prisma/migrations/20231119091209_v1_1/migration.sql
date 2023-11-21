/*
  Warnings:

  - You are about to drop the column `board` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `moves_history` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `match` table. All the data in the column will be lost.
  - Added the required column `started_at` to the `match` table without a default value. This is not possible if the table is not empty.
  - Made the column `reason` on table `match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "board",
DROP COLUMN "created_at",
DROP COLUMN "moves_history",
DROP COLUMN "winner",
ADD COLUMN     "history" TEXT[],
ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
ADD COLUMN     "started_at" TEXT NOT NULL,
ALTER COLUMN "reason" SET NOT NULL,
ALTER COLUMN "reason" SET DEFAULT '';
