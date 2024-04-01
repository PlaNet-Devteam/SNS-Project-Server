import { Module, forwardRef } from '@nestjs/common';
import { DirectMessageGateway } from './chat-message/direct-message.gateway';
import { DirectMessageService } from './chat-message/direct-message.service';
import { MessageService } from 'src/modules/message/message.service';
import { MessageModule } from 'src/modules/message/message.module';
import { messageProviders } from 'src/modules/message/message.provider';
import { DatabaseModule } from 'src/config';
import { RoomModule } from 'src/modules/room/room.module';
import { roomProviders } from 'src/modules/room/room.provider';
import { mapperUserRoomProviders } from 'src/modules/mapper-user-room/mapper-user-room.provider';
import { MapperUserRoomModule } from 'src/modules';

@Module({
  imports: [DatabaseModule, MessageModule, RoomModule, MapperUserRoomModule],
  providers: [
    DirectMessageGateway,
    {
      provide: 'DIRECT_MESSAGE_SERVICE',
      useClass: DirectMessageService,
    },
    ...messageProviders,
    ...roomProviders,
    ...mapperUserRoomProviders,
  ],
})
export class BaseGatewayModule {}
