import { Prisma } from "@prisma/client";

export type UserWithGames = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    banned: true;
    banReason: true;
    createdAt: true;
    updatedAt: true;
    roles: true;
    games: true;
    gamesWon: true;
    createdGames: true;
    whiteGames: true;
    blackGames: true;
  };
}>;