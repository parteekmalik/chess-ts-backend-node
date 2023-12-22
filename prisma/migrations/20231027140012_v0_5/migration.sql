/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Match` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `black` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `board` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameType` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `white` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `match_history` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
ADD COLUMN     "black" INTEGER NOT NULL,
ADD COLUMN     "board" TEXT NOT NULL,
ADD COLUMN     "gameType" JSONB NOT NULL,
ADD COLUMN     "match_id" SERIAL NOT NULL,
ADD COLUMN     "white" INTEGER NOT NULL,
ALTER COLUMN "startedAt" SET DATA TYPE TEXT,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "match_history" INTEGER NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");
