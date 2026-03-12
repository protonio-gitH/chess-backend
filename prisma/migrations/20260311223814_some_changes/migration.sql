/*
  Warnings:

  - You are about to drop the column `gameId` on the `BoardStorage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[boardStorageId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boardStorageId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BoardStorage" DROP CONSTRAINT "BoardStorage_gameId_fkey";

-- DropIndex
DROP INDEX "public"."BoardStorage_gameId_key";

-- DropIndex
DROP INDEX "public"."Game_winnerId_key";

-- AlterTable
ALTER TABLE "public"."BoardStorage" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "boardStorageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_boardStorageId_key" ON "public"."Game"("boardStorageId");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_boardStorageId_fkey" FOREIGN KEY ("boardStorageId") REFERENCES "public"."BoardStorage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
