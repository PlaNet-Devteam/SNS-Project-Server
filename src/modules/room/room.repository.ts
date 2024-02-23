import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomCreateDto } from './dto';
import { MapperUserRoom } from '../mapper-user-room/mapper-user-room.entity';
import { User } from '../user/user.entity';
import { RoomFindOneVo } from './vo';

@Injectable()
export class RoomRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.ROOM)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findAll() {
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.users', 'users')
      .getMany();
  }

  async findOneByRoomUniqueId(roomUniqueId: string) {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.users', 'users')
      .leftJoinAndSelect('room.messages', 'messages')
      .where('room.roomUniqueId = :roomUniqueId', { roomUniqueId })
      .getOne();
    return room;
  }

  async findOneById(id: number) {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.users', 'users')
      .leftJoinAndSelect('room.messages', 'messages')
      .where('room.id = :id', { id })
      .getOne();

    for (const message of room.messages) {
      message.user = await User.findOne({ where: { id: message.userId } });
    }

    return room;
  }

  async findOneByUsers(userIds: number[]) {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.users', 'users')
      .leftJoinAndSelect('room.messages', 'messages')
      .getOne();

    for (const message of room.messages) {
      message.user = await User.findOne({ where: { id: message.userId } });
    }

    return room;
  }

  async createRoom(roomUniqueId: string, userIds: number[]) {
    const room = await dataSource.transaction(async (transaction) => {
      let newRoom = new Room();
      newRoom.roomUniqueId = roomUniqueId;
      newRoom = await transaction.save(newRoom);

      // * MAPPER USER ROOM 생성
      await Promise.all(
        userIds.map(async (userId) => {
          let newUserRoom = new MapperUserRoom().set({
            userId: userId,
            roomId: newRoom.id,
          });
          newUserRoom = await transaction.save(newUserRoom);
        }),
      );

      return newRoom;
    });

    return room;
  }
}
