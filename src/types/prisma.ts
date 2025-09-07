import { Prisma } from '@prisma/client';

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true };
}>;

type UserRepository = Prisma.UserDelegate;

type RoleRepository = Prisma.RoleDelegate;

export type { UserWithRoles, UserRepository, RoleRepository };
