/*
  Warnings:

  - You are about to drop the column `playerOneId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `playerTwoId` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_playerOneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_playerTwoId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "playerOneId",
DROP COLUMN "playerTwoId";

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
