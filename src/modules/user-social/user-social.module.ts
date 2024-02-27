import { Module } from '@nestjs/common';
import { userSocialProviders } from './user-social.provider';
import { UserSocialRepository } from './user-social.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserSocialService } from './user-social.service';
import { UserSocialController } from './user-social.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserSocialController],
  providers: [...userSocialProviders, UserSocialRepository, UserSocialService],
  exports: [UserSocialModule, UserSocialRepository, UserSocialService],
})
export class UserSocialModule {}
