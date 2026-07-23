import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataBaseService } from 'src/database/database.service';
import type { GameRepository } from './types';
import type { BoardStorage } from '@prisma/client';
import { JoinGameDto } from './dto/join-game-dto';
import { MoveDto } from './dto/move-dto';
import { JwtService } from '@nestjs/jwt';
import { GameStatus, GameTurns } from '@prisma/client';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  private server: Server;
  private readonly gameRepository: GameRepository;
  private timerIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly db: DataBaseService,
    private readonly jwtService: JwtService,
  ) {
    this.gameRepository = this.db.game;
  }

  public handleConnection(client: Socket) {
    try {
      console.log('Client connected', client.id);
      //   const token = client.handshake.auth.token;
      //   if (token) {
      //     const userData = this.jwtService.verify(token, {
      //       secret: process.env.PRIVATE_KEY,
      //     });
      //     client.data.user = userData;
      //     // console.log('User data:', userData);
      //   }
    } catch (error: unknown) {
      console.error('Error during connection:', getErrorMessage(error));
    }
  }
  // Как вариант сделать отсчет на фронте, где он будет отсчитывать от даты последнего хода
  private startTimerBroadcast(gameId: string) {
    if (this.timerIntervals.has(gameId)) return;
    const interval = setInterval(async () => {
      const game = await this.gameRepository.findUnique({
        where: { id: gameId },
      });
      if (game && game.status === GameStatus.in_progress) {
        const updatedGame = await this.gameRepository.update({
          where: { id: gameId },
          data: {
            [game.turn === GameTurns.white ? 'whiteTimer' : 'blackTimer']:
              game.turn === GameTurns.white ? game.whiteTimer - 1000 : game.blackTimer - 1000,
          },
        });

        if (updatedGame.whiteTimer <= 0 || updatedGame.blackTimer <= 0) {
          this.stopTimerBroadcast(gameId);
        } else {
          this.server.to(gameId).emit('timer-update', {
            whiteTimer: updatedGame.whiteTimer,
            blackTimer: updatedGame.blackTimer,
          });
        }
      } else if (game && game.status === GameStatus.finished) {
        this.stopTimerBroadcast(gameId);
      }
    }, 1000);
    this.timerIntervals.set(gameId, interval);
  }

  private stopTimerBroadcast(gameId: string) {
    const interval = this.timerIntervals.get(gameId);
    if (interval) {
      clearInterval(interval);
      this.timerIntervals.delete(gameId);
    }
  }

  public handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join-game')
  public async handleJoin(
    @MessageBody() data: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ): Promise<{
    data: {
      board: BoardStorage['board'] | null;
      whiteTimer: number;
      blackTimer: number;
      lastMoveTime: Date | null;
    };
  }> {
    client.join(data.gameId);
    const game = await this.gameRepository.findFirst({
      where: { id: data.gameId },
      include: { boardStorage: {} },
    });
    //   console.log(
    //     'White timer:',
    //     game2!.whiteTimer / 1000 / 60,
    //     'Black timer:',
    //     game2!.blackTimer / 1000 / 60,
    //   );
    //   data.move.whiteTimer = game2!.whiteTimer;
    //   data.move.blackTimer = game2!.blackTimer;
    const sendData: {
      board: BoardStorage['board'] | null;
      whiteTimer: number;
      blackTimer: number;
      lastMoveTime: Date | null;
    } = {
      whiteTimer: game?.whiteTimer ?? 0,
      blackTimer: game?.blackTimer ?? 0,
      board: game?.boardStorage?.board ?? null,
      lastMoveTime: game?.lastMoveTime ?? null,
    };

    return { data: sendData };
  }

  @SubscribeMessage('get-timers')
  public async handleGetTimers(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<{ whiteTimer: number; blackTimer: number }> {
    const game = await this.gameRepository.findUnique({
      where: { id: data.gameId },
    });
    if (!game) {
      throw new Error('Game not found');
    }
    return {
      whiteTimer: game.whiteTimer,
      blackTimer: game.blackTimer,
    };
  }

  @SubscribeMessage('move')
  public async handleMove(
    @MessageBody()
    data: MoveDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // логика хода
    const game = await this.gameRepository.findUnique({
      where: { id: data.gameId },
    });
    if (game) {
      const now = Date.now();
      let elapsed = 0;
      if (game.lastMoveTime) {
        elapsed = now - game.lastMoveTime.getTime();
      }
      //   await this.db.boardStorage.update({
      //     where: { id: game.boardStorageId },
      //     data: {
      //       board: data.move.boardDTO,
      //       lastMove: data.move.lastMove,
      //     },
      //   });

      const updatedGame = await this.db.$transaction(async (tx) => {
        await tx.boardStorage.update({
          where: { id: game.boardStorageId },
          data: {
            board: data.move.boardDTO,
            lastMove: data.move.lastMove,
          },
        });
        return await tx.game.update({
          where: { id: data.gameId },
          data: {
            lastMoveTime: new Date(),
            [game.turn === GameTurns.white ? 'whiteTimer' : 'blackTimer']:
              game.turn === GameTurns.white ? game.whiteTimer - elapsed : game.blackTimer - elapsed,
            turn: game.turn === GameTurns.white ? GameTurns.black : GameTurns.white,
          },
        });
      });
      //   const game2 = await this.gameRepository.findUnique({
      //     where: { id: data.gameId },
      //   });
      //   console.log(
      //     'White timer:',
      //     game2!.whiteTimer / 1000 / 60,
      //     'Black timer:',
      //     game2!.blackTimer / 1000 / 60,
      //   );
      //   data.move.whiteTimer = game2!.whiteTimer;
      //   data.move.blackTimer = game2!.blackTimer;
      if (
        updatedGame?.status === GameStatus.in_progress &&
        updatedGame.lastMoveTime &&
        !!updatedGame.whiteTimer &&
        !!updatedGame.blackTimer
      ) {
        data.move.whiteTimer = updatedGame.whiteTimer;
        data.move.blackTimer = updatedGame.blackTimer;
        data.move.lastMoveTime = updatedGame.lastMoveTime;
        this.server.to(data.gameId).emit('move-made', data.move);
      }
    }
  }
}
