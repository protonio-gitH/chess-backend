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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  private server: Server;
  private readonly gameRepository: GameRepository;

  constructor(private readonly db: DataBaseService) {
    this.gameRepository = this.db.game;
  }

  public handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  public handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join-game')
  public async handleJoin(
    @MessageBody() data: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ): Promise<{ data: BoardStorage['board'] | null }> {
    client.join(data.gameId);
    const game = await this.gameRepository.findFirst({
      where: { id: data.gameId },
      include: { boardStorage: {} },
    });
    return { data: game?.boardStorage?.board ?? null };
  }

  @SubscribeMessage('move')
  public async handleMove(
    @MessageBody()
    data: MoveDto,
  ): Promise<void> {
    // логика хода
    const game = await this.gameRepository.findUnique({
      where: { id: data.gameId },
    });
    if (game) {
      await this.db.boardStorage.update({
        where: { id: game.boardStorageId },
        data: {
          board: data.move.boardDTO,
          lastMove: data.move.lastMove,
        },
      });
      this.server.to(data.gameId).emit('move-made', data.move);
    }
  }
}
