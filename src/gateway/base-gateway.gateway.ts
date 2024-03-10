import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ['GET', 'POST'],
    transports: ['websocket'], // websocket이 지원되지 않는 환경 일 경우 polling 방식으로 동작
    credentials: true,
  },
  allowEIO3: true, // Engiine.IO 실시간 양방향 통신을 지원하는 유사한 기술, 지원되지 않는 환경에서 실시간 통신 제공
})
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BaseGateway');

  @WebSocketServer() public server: Server;

  handleConnection(client: Socket) {
    console.log('User connected successfully');
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
