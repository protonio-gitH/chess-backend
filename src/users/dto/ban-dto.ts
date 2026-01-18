import { IsString, IsUUID } from 'class-validator';

export class BanDto {
  @IsUUID()
  readonly userId: string;
  @IsString()
  readonly banReason: string;
}
