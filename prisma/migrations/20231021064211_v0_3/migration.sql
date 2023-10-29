/*
  Warnings:

  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_id_fkey";

-- DropTable
DROP TABLE "History";

-- CreateTable
CREATE TABLE "Maches" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "movesHistory" TEXT[],
    "winner" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Maches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Maches" ADD CONSTRAINT "Maches_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
