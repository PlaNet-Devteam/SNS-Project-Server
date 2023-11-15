import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatUserGatewayDto } from './dto';

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');
  private chatRooms: Map<string, Set<Socket>> = new Map();

  @WebSocketServer() public server: Server;

  handleConnection(client: Socket) {
    console.log('User connected successfully');
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() chatUserGatewayDto: ChatUserGatewayDto): void {
    this.server.sockets
      .to(chatUserGatewayDto.roomId)
      .emit('message', chatUserGatewayDto);
  }

  @SubscribeMessage('join_room')
  createJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatUserGatewayDto: ChatUserGatewayDto,
  ) {
    if (!this.chatRooms.has(chatUserGatewayDto.roomId)) {
      this.chatRooms.set(chatUserGatewayDto.roomId, new Set());
    }
    this.chatRooms.get(chatUserGatewayDto.roomId).add(client);

    client.join(chatUserGatewayDto.roomId);
    this.server.sockets
      .to(chatUserGatewayDto.roomId)
      .emit('join_room', `join the room ${chatUserGatewayDto.roomId}`);
  }
}
