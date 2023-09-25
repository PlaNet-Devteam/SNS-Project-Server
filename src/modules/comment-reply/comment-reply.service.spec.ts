import { Test, TestingModule } from '@nestjs/testing';
import { CommentReplyService } from './comment-reply.service';
import { commentReplyProviders } from './comment-reply.provider';
import { CommentReplyRepository } from './comment-reply.repository';
import { DatabaseModule } from 'src/config/database/database.module';

describe('CommentReplyService', () => {
  let commentService: CommentReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ...commentReplyProviders,
        CommentReplyRepository,
        CommentReplyService,
      ],
    }).compile();

    commentService = module.get<CommentReplyService>(CommentReplyService);
  });

  it('check if service runs', () => {
    expect(commentService).toBeDefined();
  });
});
