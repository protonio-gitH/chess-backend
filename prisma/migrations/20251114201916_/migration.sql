-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_playerTwoId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" ALTER COLUMN "playerTwoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
