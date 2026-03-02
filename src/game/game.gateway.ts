import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataBaseService } from 'src/database/database.service';
import { GameRepository } from './types';
import { BoardStorage } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
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
    @MessageBody() data: { gameId: string },
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
  public handleMove(@MessageBody() data: { gameId: string; move: any }) {
    // логика хода
    this.server.to(data.gameId).emit('move-made', data.move);
  }
}
