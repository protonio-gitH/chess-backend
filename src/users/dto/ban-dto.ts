import { IsString, IsNumber, isString } from 'class-validator';

export class BanDto {
  @IsString()
  readonly userId: string;
  @IsString()
  readonly banReason: string;
}
