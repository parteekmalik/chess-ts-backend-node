/*
  Warnings:

  - You are about to drop the column `reason` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "reason",
ADD COLUMN     "stats" TEXT NOT NULL DEFAULT '';
