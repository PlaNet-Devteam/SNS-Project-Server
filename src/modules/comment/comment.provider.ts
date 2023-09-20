import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { Comment } from './comment.entity';

export const commentProviders = [
  {
    provide: DB_CONST_REPOSITORY.COMMENT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
