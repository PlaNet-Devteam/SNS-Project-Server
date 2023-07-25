import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { HashService } from '../auth/hash.service';
import { feedProviders } from './feed.provider';
import { FeedRepository } from './feed.repository';
import { DatabaseModule } from 'src/config/database/database.module';

describe('FeedService', () => {
  let feedService: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [...feedProviders, FeedRepository, FeedService, HashService],
    }).compile();

    feedService = module.get<FeedService>(FeedService);
  });

  it('check if service runs', () => {
    expect(feedService).toBeDefined();
  });
});
