import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageListCreateDto } from './dto';
import { RoomRepository } from '../room/room.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly roomRepository: RoomRepository,
  ) {}

  /**
   * 룸 아이디별 메세지
   * @param roomUniqueId
   */
  async findAll(roomUniqueId: string) {
    const room = await this.roomRepository.findOneByRoomUniqueId(roomUniqueId);
    if (!room) throw new NotFoundException('존재하지 않는 채팅방입니다');
    return await this.messageRepository.findAll(room.id);
  }

  async createMessage(messageListCreateDto: MessageListCreateDto) {
    return await this.messageRepository.createMessage(messageListCreateDto);
  }
}
