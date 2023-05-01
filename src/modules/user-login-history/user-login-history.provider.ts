import { DATABASE_SOURCES, DB_CONST_REPOSITORY } from 'src/config';
import { DataSource } from 'typeorm';
import { UserLoginHistory } from './user-login-history.entity';
export const userLoginHistoryProviders = [
  {
    provide: DB_CONST_REPOSITORY.USER_LOGIN_HISTORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserLoginHistory),
    inject: [DATABASE_SOURCES.DATA_SOURCE],
  },
];
