import { Role } from '@prisma/client';

export interface JwtPayload {
  email: string;
  id: string;
  roles: Role[];
}
