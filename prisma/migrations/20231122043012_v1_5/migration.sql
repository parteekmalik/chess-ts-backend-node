-- CreateTable
CREATE TABLE "watingplayer" (
    "userid" INTEGER NOT NULL,
    "basetime" INTEGER NOT NULL,
    "incrementtime" INTEGER NOT NULL,
    "time" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "watingplayer_userid_key" ON "watingplayer"("userid");
