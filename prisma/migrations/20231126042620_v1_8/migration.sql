/*
  Warnings:

  - The `match_history` column on the `profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `is_guest` to the `watingplayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "match_history",
ADD COLUMN     "match_history" INTEGER[];

-- AlterTable
ALTER TABLE "watingplayer" ADD COLUMN     "is_guest" BOOLEAN NOT NULL,
ADD COLUMN     "match_id" INTEGER NOT NULL DEFAULT -1;

-- CreateTable
CREATE TABLE "gest_users" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "gest_users_user_id_key" ON "gest_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gest_users_user_name_key" ON "gest_users"("user_name");
