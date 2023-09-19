import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config';
import { FeedModule } from '../feed/feed.module';
import { feedProviders } from '../feed/feed.provider';
import { commentProviders } from './comment.provider';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { CommentController } from './comment.controller';

@Module({
  imports: [DatabaseModule, FeedModule],
  controllers: [CommentController],
  providers: [
    ...commentProviders,
    ...feedProviders,
    CommentService,
    CommentRepository,
  ],
  exports: [CommentModule, CommentService, CommentRepository],
})
export class CommentModule {}
