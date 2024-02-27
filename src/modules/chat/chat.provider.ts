import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { ChatRoom } from './entitys/chat-room.entity';
import { ChatMessage } from './entitys/chat-message.entity';

export const chatProviders = [
  {
    provide: DB_CONST_REPOSITORY.CHAT_ROOM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatRoom),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
  {
    provide: DB_CONST_REPOSITORY.CHAT_CONTENT,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatMessage),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
