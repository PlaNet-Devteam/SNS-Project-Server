import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { MapperUserRoom } from './mapper-user-room.entity';
import { MapperUserRoomCreateDto } from './dto';
import { User } from '../user/user.entity';

@Injectable()
export class MapperUserRoomRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.MAPPER_USER_ROOM)
    private readonly mapperUserRoomRepository: Repository<MapperUserRoom>,
  ) {}

  async findAllByUser(userId: number) {
    const mapper = await this.mapperUserRoomRepository
      .createQueryBuilder('mapperUserRoom')
      .where('mapperUserRoom.userId = :userId', { userId })
      .getMany();

    return mapper;
  }

  async findAllByRoomId(roomId: string) {
    const mapper = await this.mapperUserRoomRepository
      .createQueryBuilder('mapperUserRoom')
      .innerJoinAndSelect('mapperUserRoom.user', 'user')
      .where('mapperUserRoom.roomId = :roomId', { roomId })
      .getMany();

    return mapper;
  }

  async findOneByUserId(userId: number) {
    await this.mapperUserRoomRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async findRoomIdByUserIds(userIds: number[]): Promise<number> {
    const roomIds = this.mapperUserRoomRepository
      .createQueryBuilder('mapperUserRoom')
      .select('mapperUserRoom.roomId', 'roomId')
      .where('mapperUserRoom.userId IN (:...userIds)', { userIds })
      .groupBy('mapperUserRoom.roomId')
      .having('COUNT(DISTINCT mapperUserRoom.userId) = :count', { count: 2 });

    const result = await roomIds.getRawMany<MapperUserRoom>();
    const [roomId] = result.map((room) => room.roomId);
    return roomId;
  }

  async createMapperUserRoom(mapperUserRoomCreateDto: MapperUserRoomCreateDto) {
    return await dataSource.transaction(async (transaction) => {
      // let newMapper = new MapperUserRoom(mapperUserRoomCreateDto);
      // newMapper = await transaction.save(newMapper);
    });
  }
}
