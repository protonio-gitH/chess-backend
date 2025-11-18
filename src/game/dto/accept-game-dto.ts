import { IsString } from 'class-validator';

export class AcceptGameDto {
  @IsString()
  readonly gameId: string;
  @IsString()
  readonly userId: string;
}
