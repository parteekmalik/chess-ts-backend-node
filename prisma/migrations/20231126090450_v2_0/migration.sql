/*
  Warnings:

  - You are about to drop the column `name` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `basetime` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `incrementtime` on the `watingplayer` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `watingplayer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_name]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `watingplayer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_name` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_time` to the `watingplayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `increment_time` to the `watingplayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `watingplayer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_userid_key";

-- DropIndex
DROP INDEX "watingplayer_userid_key";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "name",
ADD COLUMN     "user_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userid",
ADD COLUMN     "user_id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "watingplayer" DROP COLUMN "basetime",
DROP COLUMN "incrementtime",
DROP COLUMN "userid",
ADD COLUMN     "base_time" INTEGER NOT NULL,
ADD COLUMN     "increment_time" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_name_key" ON "profile"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "watingplayer_user_id_key" ON "watingplayer"("user_id");
