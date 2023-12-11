import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { MapperUserRoom } from './mapper-user-room.entity';

export const mapperUserRoomProviders = [
  {
    provide: DB_CONST_REPOSITORY.MAPPER_USER_ROOM,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MapperUserRoom),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
