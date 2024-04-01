import { Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from '../base-gateway.gateway';
import { DirectMessageService } from './direct-message.service';
import {
  CreateMessageGatewayDto,
  CreateRoomGatewayDto,
  JoinCreateRoomGatewayDto,
  JoinRoomGatewayDto,
} from './dto';

export class DirectMessageGateway extends BaseGateway {
  constructor(
    @Inject('DIRECT_MESSAGE_SERVICE')
    private readonly chatMessageService: DirectMessageService,
  ) {
    super();
  }

  @SubscribeMessage('create_room')
  async createRoom(@MessageBody() createRoomGatewayDto: CreateRoomGatewayDto) {
    const roomUniqueId = await this.chatMessageService.createOrJoinChatRoom(
      createRoomGatewayDto.userIds,
    );

    if (roomUniqueId) {
      this.server.sockets
        .to(`user_${createRoomGatewayDto.userId}_create_room`)
        .emit('create_room', roomUniqueId);
    }
  }

  @SubscribeMessage('join_create_room')
  joinCreateRoom(
    @MessageBody() joinCreateRoomGatewayDto: JoinCreateRoomGatewayDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${joinCreateRoomGatewayDto.userId}_create_room`);
    this.server.sockets
      .to(`user_${joinCreateRoomGatewayDto.userId}_create_room`)
      .emit('join_create_room', joinCreateRoomGatewayDto.userId);
  }

  @SubscribeMessage('message')
  createMessage(
    @MessageBody() directMessageGatewayDto: CreateMessageGatewayDto,
  ) {
    this.chatMessageService.createMessage(directMessageGatewayDto);
    this.server.sockets
      .to(`${directMessageGatewayDto.roomUniqueId}`)
      .emit('message', directMessageGatewayDto.message);
  }

  @SubscribeMessage('save_message')
  saveMessage(@MessageBody() joinRoomGatewayDto: JoinRoomGatewayDto) {
    this.chatMessageService.saveMessage(joinRoomGatewayDto);
    this.server.sockets
      .to(`${joinRoomGatewayDto.roomUniqueId}`)
      .emit('save_message', '메세지 저장');
  }

  @SubscribeMessage('join_room')
  createJoinRoom(
    @MessageBody() joinRoomGatewayDto: JoinRoomGatewayDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`${joinRoomGatewayDto.roomUniqueId}`);
    this.server.sockets
      .to(`${joinRoomGatewayDto.roomUniqueId}`)
      .emit('join_room', joinRoomGatewayDto.roomUniqueId);
  }
}
