import { Injectable } from '@nestjs/common';
import { MapperUserRoomRepository } from './mapper-user-room.repository';
import { User } from '../user/user.entity';

@Injectable()
export class MapperUserRoomService {
  constructor(private mapperUserRoomRepository: MapperUserRoomRepository) {}

  async findOneByUserId(userId: number) {
    return await this.mapperUserRoomRepository.findOneByUserId(userId);
  }

  async findRoomIdByUserIds(userIds: number[]) {
    return await this.mapperUserRoomRepository.findRoomIdByUserIds(userIds);
  }
}
