import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { DatabaseModule } from 'src/config';
import { MapperUserRoomModule } from '../mapper-user-room/mapper-user-room.module';
import { RoomRepository } from './room.repository';
import { roomProviders } from './room.provider';

@Module({
  imports: [DatabaseModule, MapperUserRoomModule],
  controllers: [RoomController],
  providers: [...roomProviders, RoomService, RoomRepository],
  exports: [RoomModule, RoomService, RoomRepository],
})
export class RoomModule {}
