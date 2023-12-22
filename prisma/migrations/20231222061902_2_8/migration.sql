/*
  Warnings:

  - The `moves` column on the `puzzles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `rating` on the `puzzles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rating_deviation` on the `puzzles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "puzzles" DROP COLUMN "moves",
ADD COLUMN     "moves" TEXT[],
DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL,
DROP COLUMN "rating_deviation",
ADD COLUMN     "rating_deviation" INTEGER NOT NULL;
