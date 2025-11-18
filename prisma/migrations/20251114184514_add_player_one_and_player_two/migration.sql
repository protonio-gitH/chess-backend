/*
  Warnings:

  - You are about to drop the `_GamePlayers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerOneId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwoId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_GamePlayers" DROP CONSTRAINT "_GamePlayers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GamePlayers" DROP CONSTRAINT "_GamePlayers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "playerOneId" INTEGER NOT NULL,
ADD COLUMN     "playerTwoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_GamePlayers";

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
