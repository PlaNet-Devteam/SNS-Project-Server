import { Module } from '@nestjs/common';
import { feedProviders } from './feed.provider';
import { FeedRepository } from './feed.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [FeedController],
  providers: [...userProviders, ...feedProviders, FeedRepository, FeedService],
  exports: [FeedModule, FeedRepository, FeedService],
})
export class FeedModule {}
