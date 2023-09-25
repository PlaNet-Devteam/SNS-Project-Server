import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config';
import { commentReplyProviders } from './comment-reply.provider';
import { CommentReplyService } from './comment-reply.service';
import { CommentReplyRepository } from './comment-reply.repository';
import { CommentReplyController } from './comment-reply.controller';
import { CommentModule } from '../comment/comment.module';
import { commentProviders } from '../comment/comment.provider';

@Module({
  imports: [DatabaseModule, CommentModule],
  controllers: [CommentReplyController],
  providers: [
    ...commentReplyProviders,
    ...commentProviders,
    CommentReplyService,
    CommentReplyRepository,
  ],
  exports: [CommentReplyModule, CommentReplyService, CommentReplyRepository],
})
export class CommentReplyModule {}
