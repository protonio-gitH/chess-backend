import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join-game')
  handleJoin(@MessageBody() data: { gameId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.gameId);
    return { status: 'ok' };
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: { gameId: string; move: any }) {
    // логика хода
    this.server.to(data.gameId).emit('move-made', data.move);
  }
}
