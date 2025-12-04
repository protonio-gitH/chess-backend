import { Role } from '@prisma/client';

export interface GenerateTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  email: string;
  id: string;
  roles: Role[];
}
