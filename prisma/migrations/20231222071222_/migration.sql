/*
  Warnings:

  - You are about to drop the column `ncrementTime` on the `match` table. All the data in the column will be lost.
  - Added the required column `incrementTime` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "ncrementTime",
ADD COLUMN     "incrementTime" INTEGER NOT NULL;
