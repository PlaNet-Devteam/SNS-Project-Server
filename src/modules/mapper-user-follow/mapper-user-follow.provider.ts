import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { MapperUserFollow } from './mapper-user-follow.entity';

export const mapperUserFollowProviders = [
  {
    provide: DB_CONST_REPOSITORY.MAPPER_USER_FOLLOW,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MapperUserFollow),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
