import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { MapperUserRoomRepository } from '../mapper-user-room/mapper-user-room.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly mapperUserRoomRepository: MapperUserRoomRepository,
  ) {}

  /**
   * 유저아이디 별 룸
   * @param userId
   */
  async findAllByUser(userId: number) {
    const userRoomMappers = await this.mapperUserRoomRepository.findAllByUser(
      userId,
    );

    const rooms = await Promise.all(
      userRoomMappers.map(async (mapper) => {
        const roomId = mapper.roomId;
        const rooms = await this.roomRepository.findOneById(roomId);
        return rooms;
      }),
    );

    const filteredRooms = rooms.map((room) => ({
      ...room,
      users: room.users.filter((user) => user.id !== userId),
    }));

    return filteredRooms;
  }

  async findOneByRoomUniqueId(roomUniqueId: string) {
    return await this.roomRepository.findOneByRoomUniqueId(roomUniqueId);
  }

  async createRoom(roomUniqeId: string, userIds: number[]) {
    const newRoom = await this.roomRepository.createRoom(roomUniqeId, [
      ...userIds,
    ]);

    return newRoom;
  }
}
