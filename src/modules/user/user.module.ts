import { Module } from '@nestjs/common';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from '../auth/hash.service';
import { userBlockProviders } from '../user-block/user-block.provider';
import { UserBlockModule } from '../user-block/user-block.module';
import { MapperUserFollowModule } from '../mapper-user-follow/mapper-user-follow.module';

@Module({
  imports: [DatabaseModule, UserBlockModule, MapperUserFollowModule],
  controllers: [UserController],
  providers: [
    ...userProviders,
    ...userBlockProviders,
    UserRepository,
    UserService,
    HashService,
  ],
  exports: [UserModule, UserRepository, UserService],
})
export class UserModule {}
