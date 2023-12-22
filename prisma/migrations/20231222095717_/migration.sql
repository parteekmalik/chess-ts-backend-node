/*
  Warnings:

  - You are about to drop the column `startedAt` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "startedAt",
ADD COLUMN     "startedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
