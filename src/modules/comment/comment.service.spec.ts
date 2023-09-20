import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { commentProviders } from './comment.provider';
import { CommentRepository } from './comment.repository';
import { DatabaseModule } from 'src/config/database/database.module';

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [...commentProviders, CommentRepository, CommentService],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
  });

  it('check if service runs', () => {
    expect(commentService).toBeDefined();
  });
});
