import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import { FeedFindOneVo } from './vo';
import { User } from '../user/user.entity';

@Injectable()
export class FeedRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.FEED)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  // SELECTS

  /**
   * 전체 피드 목록
   * @returns
   */
  public async findAll(): Promise<FeedFindOneVo[]> {
    const feeds = await this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .getMany();
    return feeds;
  }

  /**
   * 유저별 피드 목록
   * @param userId
   * @returns
   */
  public async findAllByUser(userId: number): Promise<FeedFindOneVo[]> {
    const feeds = await this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .where('feed.userId = :userId', { userId: userId })
      .getMany();

    return feeds;
  }

  /**
   * 피드 상세
   * @param id
   * @returns FeedFindOneVo
   */
  public async findOneFeed(id: number): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository
      .createQueryBuilder('feed')
      .select([
        'feed.id',
        'feed.description',
        'feed.likeCount',
        'feed.commentCount',
        'feed.show_like_count_yn',
        'feed.status',
      ])
      .where('feed.id = :id', { id: id })
      .getOne();

    return feed;
  }

  // INSERTS

  // UPDATE
}
