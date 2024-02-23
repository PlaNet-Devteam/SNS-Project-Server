import { Module, forwardRef } from '@nestjs/common';
import { DirectMessageGateway } from './chat-message/direct-message.gateway';
import { DirectMessageService } from './chat-message/direct-message.service';
import { MessageService } from 'src/modules/message/message.service';
import { MessageModule } from 'src/modules/message/message.module';
import { messageProviders } from 'src/modules/message/message.provider';
import { DatabaseModule } from 'src/config';
import { RoomModule } from 'src/modules/room/room.module';
import { roomProviders } from 'src/modules/room/room.provider';

@Module({
  imports: [DatabaseModule, MessageModule, RoomModule],
  providers: [
    DirectMessageGateway,
    {
      provide: 'DIRECT_MESSAGE_SERVICE',
      useClass: DirectMessageService,
    },
    ...messageProviders,
    ...roomProviders,
  ],
})
export class BaseGatewayModule {}
