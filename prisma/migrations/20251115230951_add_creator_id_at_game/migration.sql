/*
  Warnings:

  - Added the required column `creatorId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
