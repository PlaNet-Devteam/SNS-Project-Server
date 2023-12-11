import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';

import { Room } from './room.entity';

export const roomProviders = [
  {
    provide: DB_CONST_REPOSITORY.ROOM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Room),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
