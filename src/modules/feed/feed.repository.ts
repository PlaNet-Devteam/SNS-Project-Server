import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import { FeedFindOneVo } from './vo';
import { FEED_STATUS, YN } from 'src/common';
import { FeedCreateDto, FeedListDto } from './dto';
import { FeedImage } from '../feed-image/feed-image.entity';
import { BaseResponseVo, PaginateResponseVo } from 'src/core';
import { User } from '../user/user.entity';

@Injectable()
export class FeedRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.FEED)
    private readonly feedRepository: Repository<Feed>,
    @Inject(DB_CONST_REPOSITORY.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  // SELECTS

  /**
   * 전체 피드 목록
   * @returns
   */
  public async findAll(
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const page = feedListDto?.page;
    const limit = feedListDto?.limit;
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

    const [items, totalCount] = await feeds.getManyAndCount();
    const lasPage = Math.ceil(totalCount / limit);

    for (const item of items) {
      item.feedImages = await FeedImage.createQueryBuilder('feedImage')
        .where('feedImage.feedId = :feedId', { feedId: item.id })
        .getMany();
    }

    return {
      items: items,
      totalCount: totalCount,
      pageInfo: {
        page,
        limit,
        isLast: page === lasPage ? true : false,
      },
    };
  }

  /**
   * 유저별 피드 목록
   * @param userId
   * @returns
   */
  public async findAllByUser(
    userId: number,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const page = feedListDto?.page;
    const limit = feedListDto?.limit;
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
      .andWhere('feed.userId = :userId', { userId: userId })
      .orderBy('feed.createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await feeds.getManyAndCount();
    const lasPage = Math.ceil(totalCount / limit);

    for (const item of items) {
      item.feedImages = await FeedImage.createQueryBuilder('feedImage')
        .where('feedImage.feedId = :feedId', { feedId: item.id })
        .getMany();
    }

    return {
      items: items,
      totalCount: totalCount,
      pageInfo: {
        page,
        limit,
        isLast: page === lasPage ? true : false,
      },
    };
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
      // TODO: user feed count 증가
      let user = await this.userRepository.findOne({
        where: { id: userId },
      });

      user.feedCount++;
      user = await transaction.save(user);
      // TODO: description 에 tag 있는 경우 tag, mapper_feed_tag 테이블 생성

      return newFeed;
    });

    return feed;
  }

  // UPDATE

  /**
   *  피드 삭제
   * @param userId
   * @param feedId
   * @returns Feed
   */
  public async deleteFeed(userId: number, feedId: number) {
    await dataSource.transaction(async (transaction) => {
      // * FEED IMAGE 삭제
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(FeedImage)
        .where('feedId = :feedId', { feedId: feedId })
        .execute();

      // * FEED 삭제
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(Feed)
        .where('id = :id', { id: feedId })
        .execute();

      // * USER FEED COUNT 감소
      let user = await this.userRepository.findOne({
        where: { id: userId },
      });

      user.feedCount--;
      user = await transaction.save(user);
    });
  }
}
