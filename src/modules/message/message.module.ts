import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/config';
import { MessageRepository } from './message.repository';
import { messageProviders } from './message.provider';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [DatabaseModule, RoomModule],
  controllers: [MessageController],
  providers: [...messageProviders, MessageService, MessageRepository],
  exports: [MessageModule, MessageService, MessageRepository],
})
export class MessageModule {}
