import { IsJWT } from "class-validator";

export class DeleteTokenDto {
  @IsJWT()
  readonly refreshToken: string;
}
