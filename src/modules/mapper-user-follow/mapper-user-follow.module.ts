import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/config';
import { MapperUserFollowRepository } from './mapper-user-follow.repository';
import { MapperUserFollowController } from './mapper-user-follow.controller';
import { MapperUserFollowService } from './mapper-user-follow.service';
import { mapperUserFollowProviders } from './mapper-user-follow.provider';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';
import { UserBlockModule } from '../user-block/user-block.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    forwardRef(() => UserBlockModule),
  ],
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
