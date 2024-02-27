import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { FeedLike } from './feed-like.entity';

@Injectable()
export class FeedLikeRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.FEED_LIKE)
    private readonly feedLikeRepository: Repository<FeedLike>,
  ) {}

  // SELECT

  public async findOne(userId: number, feedId: number): Promise<FeedLike> {
    const feedLike = await this.feedLikeRepository.findOne({
      where: {
        feedId,
        userId,
      },
    });
    return feedLike;
  }
}
