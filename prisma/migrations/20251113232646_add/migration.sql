-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('waiting', 'in_progress', 'finished', 'abandoned');

-- CreateEnum
CREATE TYPE "public"."GameTurns" AS ENUM ('white', 'black');

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" SERIAL NOT NULL,
    "status" "public"."GameStatus" NOT NULL DEFAULT 'waiting',
    "turn" "public"."GameTurns" NOT NULL DEFAULT 'white',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_GamePlayers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GamePlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GamePlayers_B_index" ON "public"."_GamePlayers"("B");

-- AddForeignKey
ALTER TABLE "public"."_GamePlayers" ADD CONSTRAINT "_GamePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GamePlayers" ADD CONSTRAINT "_GamePlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
