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
import { ChatService } from './chat.service';

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer() public server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('User connected successfully');
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // this.chatService.removeClientFromRooms(client); // 채팅방 나가기
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
    this.chatService.joinRoom(client, chatUserGatewayDto.roomId);
    this.server.sockets
      .to(chatUserGatewayDto.roomId)
      .emit('join_room', `join the room ${chatUserGatewayDto.roomId}`);
  }

  @SubscribeMessage('create_room')
  createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { myName: string; otherUserName: string },
  ) {
    const { myName, otherUserName } = data;
    const roomId = this.chatService.createOrJoinChatRoom(myName, otherUserName);
    this.chatService.createRoom(roomId, client);
    this.server.sockets.to(roomId).emit('create_room', `${roomId}`);
  }

  @SubscribeMessage('get_room_list')
  handleGetRoomList(@ConnectedSocket() client: Socket) {
    const allRoomIds = this.chatService.getAllRoomIds();
    console.log(allRoomIds);
    client.emit('get_room_list', allRoomIds);
  }

  @SubscribeMessage('get_other_user')
  handleGetOtherUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; user1Id: string },
  ) {
    const { roomId, user1Id } = data;
    const otherUser = this.chatService.findUserInRoom(roomId, user1Id);
    client.emit('get_other_user', `${otherUser}`);
  }
}
