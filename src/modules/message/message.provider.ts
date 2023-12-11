import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';

import { Message } from './message.entity';

export const messageProviders = [
  {
    provide: DB_CONST_REPOSITORY.MESSAGE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
