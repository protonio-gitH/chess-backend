import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { GameRepository } from 'src/types/prisma';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class GameService {
  private readonly gameRepository: GameRepository;

  constructor(private readonly db: DataBaseService) {
    this.gameRepository = this.db.game;
  }

  public async createGame(dto: CreateGameDto): Promise<Game> {
    const user = await this.db.user.findFirstOrThrow({
      where: { id: dto.creatorId },
    });

    const inProgressGame = await this.gameRepository.findFirst({
      where: { players: { some: { userId: user.id } }, status: 'in_progress' },
    });

    if (inProgressGame) {
      throw new ConflictException('User is already in an in-progress game.');
    }

    const waitingGame = await this.gameRepository.findFirst({
      where: { creatorId: user.id, status: 'waiting' },
    });
    if (waitingGame) {
      await this.gameRepository.delete({ where: { id: waitingGame.id } });
    }

    const game = await this.db.$transaction(async (tx) => {
      const newGame = await tx.game.create({
        data: {
          creatorId: user.id,
          status: 'waiting',
        },
      });

      await tx.player.create({
        data: {
          userId: user.id,
          gameId: newGame.id,
          color: 'white',
        },
      });

      return newGame;
    });
    return game;
  }

  public async acceptGame(dto: AcceptGameDto) {
    const inProgressGame = await this.gameRepository.findFirst({
      where: {
        players: {
          some: {
            userId: dto.userId,
          },
        },
        status: {
          in: ['in_progress', 'waiting'],
        },
      },
    });
    if (inProgressGame) {
      throw new ConflictException('User is already in a game.');
    }
    const updateGame = await this.db.$transaction(async (tx) => {
      const game = await tx.game.update({
        where: { id: dto.gameId, status: 'waiting' },
        data: {
          status: 'in_progress',
        },
      });

      await tx.player.create({
        data: {
          userId: dto.userId,
          gameId: dto.gameId,
          color: 'black',
        },
      });

      return game;
    });

    return updateGame;
  }
}
