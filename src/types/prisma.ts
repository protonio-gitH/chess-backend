import { Prisma } from '@prisma/client';

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true };
}>;

type UserRepository = Prisma.UserDelegate;

type RoleRepository = Prisma.RoleDelegate;

type GameRepository = Prisma.GameDelegate;

type TokenRepository = Prisma.TokenDelegate;

export type {
  UserWithRoles,
  UserRepository,
  RoleRepository,
  GameRepository,
  TokenRepository,
};
