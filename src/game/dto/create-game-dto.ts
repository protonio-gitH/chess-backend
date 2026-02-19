import { IsJSON, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  readonly creatorId: string;
  @IsJSON()
  readonly board: string;
}
