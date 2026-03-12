import type { BoardStorage, Prisma } from '@prisma/client';
import { IsString, IsObject } from 'class-validator';

export class MoveDto {
  @IsString()
  readonly gameId: string;
  @IsObject()
  readonly move: {
    boardDTO: Prisma.InputJsonValue;
    lastMove: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  };
}
