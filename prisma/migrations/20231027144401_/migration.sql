/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Match";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "match" (
    "match_id" SERIAL NOT NULL,
    "board" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "moves_history" TEXT[],
    "winner" TEXT,
    "reason" TEXT,
    "white" INTEGER NOT NULL,
    "black" INTEGER NOT NULL,
    "game_type" JSONB NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userid" SERIAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_userid_key" ON "user"("userid");
