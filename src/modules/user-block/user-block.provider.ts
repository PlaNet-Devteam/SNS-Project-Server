import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { UserBlock } from './user-block.entity';
export const userBlockProviders = [
  {
    provide: DB_CONST_REPOSITORY.USER_BLOCK,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserBlock),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
