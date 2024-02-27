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
    this.chatService.saveChatDataToDatabase(chatUserGatewayDto);
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
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { myId: number; otherUserId: number },
  ) {
    const { myId, otherUserId } = data;
    const roomId = await this.chatService.createOrJoinChatRoom(
      myId,
      otherUserId,
    );
    this.chatService.createRoom(roomId, client);
    this.server.sockets.to(roomId).emit('create_room', `${roomId}`);
  }

  @SubscribeMessage('get_room_list')
  async handleGetRoomList(@ConnectedSocket() client: Socket) {
    const allRoomIds = await this.chatService.findAllRooms();
    client.emit('get_room_list', allRoomIds);
  }

  @SubscribeMessage('get_other_user')
  async handleGetOtherUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; user1Id: number },
  ) {
    const { roomId, user1Id } = data;
    const otherUser = await this.chatService.findUserInRoom(roomId, user1Id);
    client.emit('get_other_user', `${otherUser}`);
  }

  @SubscribeMessage('get_chat_data')
  async handleGetChatData(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const chatData = await this.chatService.findChatData(data.roomId);
    client.emit('get_chat_data', chatData);
  }
}
