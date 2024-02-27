import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { FeedLike } from './feed-like.entity';

export const feedLikeProviders = [
  {
    provide: DB_CONST_REPOSITORY.FEED_LIKE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FeedLike),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
