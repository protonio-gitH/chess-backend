import { IsString } from 'class-validator';

export class BanDto {
  @IsString()
  readonly userId: string;
  @IsString()
  readonly banReason: string;
}
