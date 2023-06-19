import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import { FeedFindOneVo } from './vo';
import { dataSource } from '../../config';
import { FeedCreateDto } from './dto';
import { FeedListDto } from './dto/feed-list.dto';
import { FEED_STATUS, YN } from 'src/common';

@Injectable()
export class FeedRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.FEED)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  // SELECTS
  // TODO: 피드 이미지 , Mapper 테이블 (tag)
  public async findAll(feedListDto?: FeedListDto): Promise<FeedFindOneVo[]> {
    const feeds = await this.feedRepository
      .createQueryBuilder('feed')
      .where('feed.displayYn = :displayYn', { displayYn: YN.Y })
      .andWhere('feed.status = :status', { status: FEED_STATUS.ACTIVE })
      .select([
        'feed.id',
        'feed.userId',
        'feed.description',
        'feed.status',
        'feed.likeCount',
        'feed.commentCount',
        'feed.showLikeCountYn',
      ])
      .orderBy('feed.createdAt', 'DESC')
      .getMany();
    return feeds;
  }

  // INSERTS

  /**
   *  피드 생성
   * @param userId
   * @param feedCreateDto
   * @returns Feed
   */
  public async createFeed(
    userId: number,
    feedCreateDto: FeedCreateDto,
  ): Promise<Feed> {
    const feed = await dataSource.transaction(async (transaction) => {
      let newFeed = new Feed(feedCreateDto);
      newFeed.userId = userId;
      // TODO: feed image  생성
      // TODO: description 에 tag 있는 경우 tag, mapper_feed_tag 테이블 생성
      newFeed = await transaction.save(newFeed);
      return newFeed;
    });

    return feed;
  }
}
