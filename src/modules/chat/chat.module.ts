import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/config/database/database.module';
import { ChatRepository } from './chat.repository';
import { chatProviders } from './chat.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ChatController],
  providers: [...chatProviders, ChatRepository, ChatService, ChatGateway],
})
export class ChatModule {}
