/*
  Warnings:

  - A unique constraint covering the columns `[winnerId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "winnerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Game_winnerId_key" ON "public"."Game"("winnerId");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
