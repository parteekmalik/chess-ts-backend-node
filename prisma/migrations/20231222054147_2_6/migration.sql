/*
  Warnings:

  - You are about to drop the column `started_at` on the `match` table. All the data in the column will be lost.
  - The `time` column on the `watingplayer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "started_at",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "watingplayer" DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
