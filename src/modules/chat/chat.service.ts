import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface ChatRoomInfo {
  roomId: string;
  user1: string;
  user2: string;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, Set<Socket>> = new Map();
  private chatRoomInfoList: ChatRoomInfo[] = [];
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

  createOrJoinChatRoom(user1: string, user2: string): string {
    const existingRoomId = this.findChatRoom(user1, user2);
    if (existingRoomId) {
      console.log('이미 채팅방이 있습니다.');
      return existingRoomId;
    }
    console.log('새 채팅방을 생성합니다.');
    const roomId = uuidv4();
    const chatRoomInfo: ChatRoomInfo = {
      roomId,
      user1,
      user2,
    };
    this.chatRoomInfoList.push(chatRoomInfo);
    this.chatRooms.set(roomId, new Set([user1, user2]));
    return roomId;
  }

  private findChatRoom(user1: string, user2: string): string | undefined {
    for (const [roomId, users] of this.chatRooms.entries()) {
      if (users.has(user1) && users.has(user2)) {
        return roomId;
      }
    }
    return undefined;
  }

  findUserInRoom(roomId: string, user1: string): string | undefined {
    const chatRoomInfo = this.chatRoomInfoList.find(
      (info) =>
        info.roomId === roomId &&
        (info.user1 === user1 || info.user2 === user1),
    );
    if (chatRoomInfo) {
      return user1 === chatRoomInfo.user1
        ? chatRoomInfo.user2
        : chatRoomInfo.user1;
    }

    return undefined;
  }
}
