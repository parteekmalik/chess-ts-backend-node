/*
  Warnings:

  - You are about to drop the column `userId` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
