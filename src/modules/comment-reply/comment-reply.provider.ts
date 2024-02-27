import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { CommentReply } from './comment-reply.entity';

export const commentReplyProviders = [
  {
    provide: DB_CONST_REPOSITORY.COMMENT_REPLY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CommentReply),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
