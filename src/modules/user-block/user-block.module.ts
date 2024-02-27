import { Module, forwardRef } from '@nestjs/common';
import { userBlockProviders } from './user-block.provider';
import { UserBlockRepository } from './user-block.repository';
import { DatabaseModule } from 'src/config';
import { UserBlockService } from './user-block.service';
import { UserBlockController } from './user-block.controller';
import { UserModule } from '../user/user.module';
import { mapperUserFollowProviders } from '../mapper-user-follow/mapper-user-follow.provider';
import { userProviders } from '../user/user.provider';
import { MapperUserFollowModule } from '../mapper-user-follow/mapper-user-follow.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    forwardRef(() => MapperUserFollowModule),
  ],
  controllers: [UserBlockController],
  providers: [
    ...userProviders,
    ...userBlockProviders,
    ...mapperUserFollowProviders,
    UserBlockRepository,
    UserBlockService,
  ],
  exports: [UserBlockModule, UserBlockRepository, UserBlockService],
})
export class UserBlockModule {}
