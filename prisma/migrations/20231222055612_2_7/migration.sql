/*
  Warnings:

  - A unique constraint covering the columns `[request_id]` on the table `watingplayer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "watingplayer_request_id_key" ON "watingplayer"("request_id");
