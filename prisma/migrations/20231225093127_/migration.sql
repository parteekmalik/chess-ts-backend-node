/*
  Warnings:

  - The `themes` column on the `puzzles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `openingTags` column on the `puzzles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "puzzles" DROP COLUMN "themes",
ADD COLUMN     "themes" TEXT[],
DROP COLUMN "openingTags",
ADD COLUMN     "openingTags" TEXT[];
