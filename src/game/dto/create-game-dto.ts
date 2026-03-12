import { type Prisma } from '@prisma/client';
import type { BoardStorage } from '@prisma/client';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  readonly creatorId: string;
  @IsNotEmpty()
  @IsObject()
  readonly board: Prisma.InputJsonValue;
}
