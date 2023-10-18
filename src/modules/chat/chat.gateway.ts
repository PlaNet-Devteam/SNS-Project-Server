import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  handleConnection(client: Socket) {
    console.log('User connected successfully');
    client.join('room');
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected');
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: any): void {
    console.log(message);
    this.server.to('room').emit('message', message);
  }
}
