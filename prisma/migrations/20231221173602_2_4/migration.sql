/*
  Warnings:

  - You are about to drop the column `history` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "history",
DROP COLUMN "time",
ADD COLUMN     "move_data" JSONB[] DEFAULT ARRAY[]::JSONB[];
