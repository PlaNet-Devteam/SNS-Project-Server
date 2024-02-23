import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from './entitys/chat-room.entity';
import { ChatMessage } from './entitys/chat-message.entity';
import { DB_CONST_REPOSITORY } from 'src/config';

@Injectable()
export class ChatRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.CHAT_ROOM)
    private readonly chatRepository: Repository<ChatRoom>,
    @Inject(DB_CONST_REPOSITORY.CHAT_CONTENT)
    private readonly chatContentRepository: Repository<ChatMessage>,
  ) {}

  async findChatRooms() {
    return await this.chatRepository.find();
  }

  async findChatData() {
    return await this.chatContentRepository.find();
  }
}
