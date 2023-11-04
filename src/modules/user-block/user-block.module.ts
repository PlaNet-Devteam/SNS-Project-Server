import { Module } from '@nestjs/common';
import { userBlockProviders } from './user-block.provider';
import { UserBlockRepository } from './user-block.repository';
import { DatabaseModule } from 'src/config';
import { UserBlockService } from './user-block.service';
import { UserBlockController } from './user-block.controller';
import { UserModule } from '../user/user.module';
import { MapperUserFollowModule } from '../mapper-user-follow/mapper-user-follow.module';

@Module({
  imports: [DatabaseModule, UserModule, MapperUserFollowModule],
  controllers: [UserBlockController],
  providers: [...userBlockProviders, UserBlockRepository, UserBlockService],
  exports: [UserBlockModule, UserBlockRepository, UserBlockService],
})
export class UserBlockModule {}
