import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { MapperFeedTag } from './mapper-feed-tag.entity';

export const mapperFeedTagProviders = [
  {
    provide: DB_CONST_REPOSITORY.MAPPER_FEED_TAG,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MapperFeedTag),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
