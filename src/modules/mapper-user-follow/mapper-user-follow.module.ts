import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config';
import { MapperUserFollowRepository } from './mapper-user-follow.repository';
import { MapperUserFollowController } from './mapper-user-follow.controller';
import { MapperUserFollowService } from './mapper-user-follow.service';
import { mapperUserFollowProviders } from './mapper-user-follow.provider';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MapperUserFollowController],
  providers: [
    ...userProviders,
    ...mapperUserFollowProviders,
    MapperUserFollowRepository,
    MapperUserFollowService,
  ],
  exports: [
    MapperUserFollowModule,
    MapperUserFollowRepository,
    MapperUserFollowService,
  ],
})
export class MapperUserFollowModule {}
