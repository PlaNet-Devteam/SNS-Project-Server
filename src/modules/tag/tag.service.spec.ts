import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { tagProviders } from './tag.provider';
import { TagRepository } from './tag.repository';
import { DatabaseModule } from 'src/config/database/database.module';

describe('TagService', () => {
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [...tagProviders, TagRepository, TagService],
    }).compile();

    tagService = module.get<TagService>(TagService);
  });

  it('check if service runs', () => {
    expect(tagService).toBeDefined();
  });
});
