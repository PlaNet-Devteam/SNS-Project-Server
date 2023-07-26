import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import { FeedFindOneVo } from './vo';
import { FEED_STATUS, YN } from 'src/common';
import { FeedCreateDto, FeedListDto } from './dto';
import { FeedImage } from '../feed-image/feed-image.entity';
import { BaseResponseVo, PaginateResponseVo } from 'src/core';

@Injectable()
export class FeedRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.FEED)
    private readonly feedRepository: Repository<Feed>, // @Inject(DB_CONST_REPOSITORY.FEED_IMAGE) // private readonly feedImageRepository: Repository<FeedImage>,
  ) {}

  // SELECTS

  /**
   * 전체 피드 목록
   * @returns
   */
  public async findAll(
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    console.log('feedListDto', feedListDto);
    const page = feedListDto?.page || 1;
    const limit = feedListDto?.limit || 10;

    const offset = (page - 1) * limit;

    const feeds = this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .select([
        'feed.id',
        'feed.userId',
        'feed.description',
        'feed.status',
        'feed.likeCount',
        'feed.commentCount',
        'feed.showLikeCountYn',
        'feed.createdAt',
        'feed.updatedAt',
        'user.id',
        'user.username',
        'user.nickname',
        'user.profileImage',
      ])
      .where('feed.displayYn = :displayYn', { displayYn: YN.Y })
      .andWhere('feed.status = :status', { status: FEED_STATUS.ACTIVE })
      .orderBy('feed.createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    const items = await feeds.getMany();

    for (const item of items) {
      item.feedImages = await FeedImage.createQueryBuilder('feedImage')
        .where('feedImage.feedId = :feedId', { feedId: item.id })
        .getMany();
    }

    return {
      items: items,
      totalCount: items.length,
      page: 2,
    };
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
      .leftJoinAndSelect('feed.feedImages', 'feedImages')
      .select([
        'feed.id',
        'feed.userId',
        'feed.description',
        'feed.status',
        'feed.likeCount',
        'feed.commentCount',
        'feed.showLikeCountYn',
        'feed.createdAt',
        'feed.updatedAt',
        'user.id',
        'user.username',
        'user.nickname',
        'user.profileImage',
        'feedImages.feedId',
        'feedImages.image',
        'feedImages.sortOrder',
      ])
      .where('feed.displayYn = :displayYn', { displayYn: YN.Y })
      .andWhere('feed.status = :status', { status: FEED_STATUS.ACTIVE })
      .andWhere('feed.userId = :userId', { userId: userId })
      .orderBy('feed.createdAt', 'DESC')
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
      newFeed = await transaction.save(newFeed);
      // TODO: feed image  생성
      if (feedCreateDto.feedImages && feedCreateDto.feedImages.length > 0) {
        await Promise.all(
          feedCreateDto.feedImages.map(async (image) => {
            let newImage = new FeedImage().set({
              feedId: newFeed.id,
              image: image.image,
              sortOrder: image.sortOrder,
            });
            newImage = await transaction.save(newImage);
          }),
        );
      }
      // TODO: description 에 tag 있는 경우 tag, mapper_feed_tag 테이블 생성

      return newFeed;
    });

    return feed;
  }

  // UPDATE
}
