-- CreateTable
CREATE TABLE "public"."BoardStorage" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "board" JSONB NOT NULL,
    "lastMove" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardStorage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardStorage_gameId_key" ON "public"."BoardStorage"("gameId");

-- AddForeignKey
ALTER TABLE "public"."BoardStorage" ADD CONSTRAINT "BoardStorage_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
