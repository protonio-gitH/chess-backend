import { IsString } from 'class-validator';

export class JoinGameDto {
  @IsString()
  readonly gameId: string;
}
