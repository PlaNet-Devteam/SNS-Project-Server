import { Module } from '@nestjs/common';
import { MapperUserRoomController } from './mapper-user-room.controller';
import { MapperUserRoomService } from './mapper-user-room.service';
import { DatabaseModule } from 'src/config';
import { MapperUserRoomRepository } from './mapper-user-room.repository';
import { mapperUserRoomProviders } from './mapper-user-room.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MapperUserRoomController],
  providers: [
    ...mapperUserRoomProviders,
    MapperUserRoomService,
    MapperUserRoomRepository,
  ],
  exports: [
    MapperUserRoomModule,
    MapperUserRoomService,
    MapperUserRoomRepository,
  ],
})
export class MapperUserRoomModule {}
