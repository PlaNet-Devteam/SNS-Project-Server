import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { UserSocial } from './user-social.entity';

export const userSocialProviders = [
  {
    provide: DB_CONST_REPOSITORY.USER_SOCIAL,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserSocial),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
