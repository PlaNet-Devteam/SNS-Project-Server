import { Module } from '@nestjs/common';
import { userLoginHistoryProviders } from './user-login-history.provider';
import { UserLoginHistoryRepository } from './user-login-history.repository';
import { DatabaseModule } from 'src/config';

@Module({
  imports: [DatabaseModule],
  providers: [UserLoginHistoryRepository],
  exports: [UserLoginHistoryModule, UserLoginHistoryRepository],
})
export class UserLoginHistoryModule {}
