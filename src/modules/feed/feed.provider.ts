import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { Feed } from './feed.entity';

export const feedProviders = [
  {
    provide: DB_CONST_REPOSITORY.FEED,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Feed),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
