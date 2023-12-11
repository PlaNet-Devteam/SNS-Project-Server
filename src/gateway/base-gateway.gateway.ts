import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
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
