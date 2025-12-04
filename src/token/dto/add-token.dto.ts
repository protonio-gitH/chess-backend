import { IsString, IsJWT } from 'class-validator';

export class AddTokenDto {
  @IsString()
  readonly userId: string;
  @IsJWT()
  readonly refreshToken: string;
}
