import { Injectable } from '@nestjs/common';
import {
  MessageCreateDto,
  MessageListCreateDto,
} from 'src/modules/message/dto';
import { MessageService } from 'src/modules/message/message.service';
import { RoomService } from 'src/modules/room/room.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageGatewayDto, JoinRoomGatewayDto } from './dto';

@Injectable()
export class DirectMessageService {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
  ) {}

  private chatRooms: Map<string, number[]> = new Map();
  private messageList: Map<string, MessageCreateDto[]> = new Map();

  createMessage(createMessageGatewayDto: CreateMessageGatewayDto) {
    if (!this.messageList.has(createMessageGatewayDto.roomUniqueId)) {
      this.messageList.set(createMessageGatewayDto.roomUniqueId, []);
    }
    this.messageList
      .get(createMessageGatewayDto.roomUniqueId)
      .push(createMessageGatewayDto.message);
  }

  getMessages(roomUniqueId: string) {
    return this.messageList.get(roomUniqueId);
  }

  async saveMessage(joinRoomGatewayDto: JoinRoomGatewayDto) {
    const messages = this.getMessages(joinRoomGatewayDto.roomUniqueId);
    const newMeesages = new MessageListCreateDto();
    newMeesages.messageList = messages;
    await this.messageService.createMessage(newMeesages);
    this.messageList.set(joinRoomGatewayDto.roomUniqueId, []);
    return this.messageList.get(joinRoomGatewayDto.roomUniqueId);
  }

  createRoom(roomUniqueId: string, userIds: number[]) {
    if (!this.chatRooms.has(roomUniqueId)) {
      this.chatRooms.set(roomUniqueId, []);
    }
    this.chatRooms.get(roomUniqueId).push(...userIds);
    this.roomService.createRoom(roomUniqueId, userIds);
  }

  createOrJoinChatRoom(userIds: number[]) {
    const existingRoomId = this.findChatRoom(userIds);
    if (existingRoomId !== undefined) {
      return existingRoomId;
    }
    const roomUniqueId = uuidv4();
    this.createRoom(roomUniqueId, userIds);
    return roomUniqueId;
  }

  findChatRoom(userIds: number[]) {
    for (const [roomUniqueId, roomUserIds] of this.chatRooms.entries()) {
      if (JSON.stringify(userIds) === JSON.stringify(roomUserIds)) {
        return roomUniqueId;
      }
    }
    return undefined;
  }
}
