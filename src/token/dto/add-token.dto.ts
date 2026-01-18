import { IsUUID, IsJWT } from 'class-validator';

export class AddTokenDto {
  @IsUUID()
  readonly userId: string;
  @IsJWT()
  readonly refreshToken: string;
}
