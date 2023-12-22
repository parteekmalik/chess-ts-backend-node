/*
  Warnings:

  - You are about to drop the column `user_id` on the `gest_users` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `gest_users` table. All the data in the column will be lost.
  - The primary key for the `match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `b` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `match_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `move_data` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `w` on the `match` table. All the data in the column will be lost.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `live_match` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `match_history` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `opening_tags` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `rating_deviation` on the `puzzles` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `base_time` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `increment_time` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `is_guest` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `match_id` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `watingplayer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `gest_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `gest_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `watingplayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `watingplayer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `gest_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blackId` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whiteId` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTags` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingDeviation` to the `puzzles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseTime` to the `watingplayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incrementTime` to the `watingplayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGuest` to the `watingplayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `watingplayer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "gest_users_user_id_key";

-- DropIndex
DROP INDEX "gest_users_user_name_key";

-- DropIndex
DROP INDEX "profile_user_name_key";

-- DropIndex
DROP INDEX "users_user_id_key";

-- DropIndex
DROP INDEX "users_user_name_key";

-- DropIndex
DROP INDEX "watingplayer_request_id_key";

-- DropIndex
DROP INDEX "watingplayer_user_id_key";

-- AlterTable
ALTER TABLE "gest_users" DROP COLUMN "user_id",
DROP COLUMN "user_name",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "match" DROP CONSTRAINT "match_pkey",
DROP COLUMN "b",
DROP COLUMN "match_id",
DROP COLUMN "move_data",
DROP COLUMN "w",
ADD COLUMN     "blackId" TEXT NOT NULL,
ADD COLUMN     "matchId" SERIAL NOT NULL,
ADD COLUMN     "moveData" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "whiteId" TEXT NOT NULL,
ADD CONSTRAINT "match_pkey" PRIMARY KEY ("matchId");

-- AlterTable
ALTER TABLE "profile" DROP CONSTRAINT "profile_pkey",
DROP COLUMN "live_match",
DROP COLUMN "match_history",
DROP COLUMN "user_id",
DROP COLUMN "user_name",
ADD COLUMN     "liveMatch" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "matchHistory" INTEGER[],
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL,
ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "puzzles" DROP COLUMN "opening_tags",
DROP COLUMN "rating_deviation",
ADD COLUMN     "openingTags" TEXT NOT NULL,
ADD COLUMN     "ratingDeviation" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_id",
DROP COLUMN "user_name",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "watingplayer" DROP COLUMN "base_time",
DROP COLUMN "increment_time",
DROP COLUMN "is_guest",
DROP COLUMN "match_id",
DROP COLUMN "request_id",
DROP COLUMN "user_id",
ADD COLUMN     "baseTime" INTEGER NOT NULL,
ADD COLUMN     "incrementTime" INTEGER NOT NULL,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL,
ADD COLUMN     "matchId" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "requestId" SERIAL NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "gest_users_userId_key" ON "gest_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "gest_users_userName_key" ON "gest_users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userName_key" ON "profile"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "watingplayer_requestId_key" ON "watingplayer"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "watingplayer_userId_key" ON "watingplayer"("userId");
