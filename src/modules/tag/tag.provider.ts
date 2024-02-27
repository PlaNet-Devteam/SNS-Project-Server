import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { Tag } from './tag.entity';

export const tagProviders = [
  {
    provide: DB_CONST_REPOSITORY.TAG,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tag),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
