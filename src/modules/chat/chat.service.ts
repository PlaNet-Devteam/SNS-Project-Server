import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { dataSource } from 'src/config';
import { ChatRoom } from './entitys/chat-room.entity';
import { ChatMessage } from './entitys/chat-message.entity';
import { ChatRepository } from './chat.repository';
import { ChatUserGatewayDto } from './dto';
import { UserRepository } from '../user/user.repository';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

export interface ChatRoomInfo {
  roomId: string;
  user1: number;
  user2: number;
  user1Name: string;
  user2Name: string;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, Set<any>> = new Map();
  private chatRoomInfoList: ChatRoomInfo[] = [];
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createRoom(roomId: string, client: Socket) {
    if (!this.chatRooms.has(roomId)) {
      this.chatRooms.set(roomId, new Set());
    }
    this.chatRooms.get(roomId).add(client);
    client.join(roomId);
  }
  joinRoom(client: Socket, roomId: string) {
    if (!this.chatRooms.has(roomId)) {
      this.chatRooms.set(roomId, new Set());
    }
    this.chatRooms.get(roomId).add(client);
    client.join(roomId);
  }
  getAllRoomIds(): ChatRoomInfo[] {
    return this.chatRoomInfoList;
  }

  removeClientFromRooms(client: Socket) {
    this.chatRooms.forEach((clients, roomId) => {
      if (clients.has(client)) {
        clients.delete(client);
        client.leave(roomId);
      }
      if (clients.size === 0) {
        this.chatRooms.delete(roomId);
      }
    });
  }

  async createOrJoinChatRoom(user1: number, user2: number) {
    const existingRoomId = await this.findChatRoom(user1, user2);
    if (existingRoomId) {
      console.log('이미 채팅방이 있습니다.');
      return existingRoomId;
    }
    console.log('새 채팅방을 생성합니다.');
    const roomId = uuidv4();
    const user1Name = await this.findUserName(user1);
    const user2Name = await this.findUserName(user2);
    const chatRoomInfo: ChatRoomInfo = {
      roomId,
      user1,
      user2,
      user1Name,
      user2Name,
    };
    dataSource.transaction(async (transaction) => {
      await this.saveRoomInfoToDatabase(chatRoomInfo, transaction);
      this.chatRoomInfoList.push(chatRoomInfo);
      this.chatRooms.set(roomId, new Set([user1, user2]));
    });

    return roomId;
  }

  private async saveRoomInfoToDatabase(
    chatRoomInfo: ChatRoomInfo,
    transaction: EntityManager,
  ): Promise<void> {
    let newChatRoom = new ChatRoom(chatRoomInfo);
    newChatRoom = await transaction.save(newChatRoom);
  }

  private async findChatRoom(
    user1: number,
    user2: number,
  ): Promise<string | undefined> {
    const chatRoomsFromDatabase = await this.findAllRooms();
    for (const chatRoom of chatRoomsFromDatabase) {
      if (
        (chatRoom.user1 === user1 && chatRoom.user2 === user2) ||
        (chatRoom.user1 === user2 && chatRoom.user2 === user1)
      ) {
        return chatRoom.roomId;
      }
    }
    return undefined;
  }

  async findUserInRoom(
    roomId: string,
    user1: number,
  ): Promise<string | undefined> {
    const chatRoomsFromDatabase = await this.findAllRooms();
    const chatRoomInfo = chatRoomsFromDatabase.find(
      (info) =>
        info.roomId === roomId &&
        (info.user1 === user1 || info.user2 === user1),
    );
    if (chatRoomInfo) {
      return user1 === chatRoomInfo.user1
        ? chatRoomInfo.user2Name
        : chatRoomInfo.user1Name;
    }

    return undefined;
  }

  async findAllRooms() {
    const chatRoomsFromDatabase = await this.chatRepository.findChatRooms();
    return chatRoomsFromDatabase;
  }

  async saveChatDataToDatabase(chatUserGatewayDto: ChatUserGatewayDto) {
    const existingChatData = await ChatMessage.findOne({
      where: { roomId: chatUserGatewayDto.roomId },
    });

    if (existingChatData) {
      existingChatData.message.push({
        sender: chatUserGatewayDto.userId,
        content: chatUserGatewayDto.message,
        timestamp: new Date().toISOString(),
      });
      await existingChatData.save();
    } else {
      const otherUser = await this.findUserInRoom(
        chatUserGatewayDto.roomId,
        chatUserGatewayDto.userId,
      );
      const user1Name = await this.findUserName(chatUserGatewayDto.userId);
      const messageColumn = {
        sender: chatUserGatewayDto.userId,
        content: chatUserGatewayDto.message,
        timestamp: new Date().toISOString(),
      };
      const newChatData = new ChatMessage({
        roomId: chatUserGatewayDto.roomId,
        participants: `${user1Name},${otherUser}`,
        message: [messageColumn],
      });
      await newChatData.save();
    }
  }

  async findChatData(roomId: string) {
    const chatDataFromDatabase = await this.chatRepository.findChatData();
    for (const ChatData of chatDataFromDatabase) {
      if (ChatData.roomId === roomId) {
        return ChatData.message;
      }
    }
    return null;
  }

  async findUserName(otherUserId: number) {
    const AllUserArr = await this.userRepository.findAllUsers();
    for (const UserData of AllUserArr) {
      if (UserData.id === otherUserId) {
        return UserData.username;
      }
    }
    return undefined;
  }
}
