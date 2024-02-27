import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { MessageCreateDto, MessageListCreateDto } from './dto';
import { ORDER_BY_VALUE } from 'src/common';

@Injectable()
export class MessageRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.MESSAGE)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll(roomId: number) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.user', 'user')
      .where('message.roomId = :roomId', { roomId })
      .orderBy('message.createdAt', ORDER_BY_VALUE.ASC)
      .getMany();
    return messages;
  }

  async createMessage(messageListCreateDto: MessageListCreateDto) {
    if (messageListCreateDto.messageList) {
      return Promise.all(
        messageListCreateDto.messageList.map(async (message) => {
          let newMessage = new Message().set({
            userId: message.userId,
            roomId: message.roomId,
            message: message.message,
          });
          newMessage = await this.messageRepository.save(newMessage);
          console.log('저장', newMessage);
        }),
      );
    }
  }
}
