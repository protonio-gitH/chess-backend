-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_blackPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_whitePlayerId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" ALTER COLUMN "blackPlayerId" DROP NOT NULL,
ALTER COLUMN "whitePlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
