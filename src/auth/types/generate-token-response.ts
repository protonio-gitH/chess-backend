import type { UserWithRoles } from 'src/users/types';

export interface GenerateTokenResponse {
  accessToken: string;
  refreshToken: string;
}
