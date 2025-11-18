import { IsNumber } from 'class-validator';

export class AcceptGameDto {
  @IsNumber()
  readonly gameId: number;
  @IsNumber()
  readonly userId: number;
}
