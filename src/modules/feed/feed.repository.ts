import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import { FeedFindOneVo } from './vo';
import { FEED_STATUS, ORDER_BY_VALUE, YN } from 'src/common';
import { FeedCreateDto, FeedListDto, FeedUpdateDto } from './dto';
import { FeedImage } from '../feed-image/feed-image.entity';
import { PaginateResponseVo } from 'src/core';
import { User } from '../user/user.entity';
import { FeedLike } from '../feed-like/feed-like.entity';
import { FeedBookmark } from '../feed-bookmark/feed-bookmark.entity';
import { MapperFeedTag } from '../mapper-feed-tag/mapper-feed-tag.entity';
import { Tag } from '../tag/tag.entity';

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
    user: User,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const page = feedListDto?.page;
    const limit = feedListDto?.limit;
    const offset = (page - 1) * limit;

    const feeds = this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .where('user.delYn = :delYn', { delYn: YN.N })
      .andWhere('feed.displayYn = :displayYn', { displayYn: YN.Y })
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

      // * 좋아요 체크 여부
      if (user.id) {
        const liked = await FeedLike.createQueryBuilder('feedLike')
          .where('feedLike.feedId = :feedId', { feedId: item.id })
          .andWhere('feedLike.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.likedYn = true;
        } else {
          item.likedYn = false;
        }
      }

      // * 북마크 체크 여부
      if (user.id) {
        const liked = await FeedBookmark.createQueryBuilder('feedBookmark')
          .where('feedBookmark.feedId = :feedId', { feedId: item.id })
          .andWhere('feedBookmark.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.bookmarkedYn = true;
        } else {
          item.bookmarkedYn = false;
        }
      }
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
   * 태그별 피드 목록
   * @returns
   */
  public async findAllByTag(
    user: User,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const page = feedListDto?.page;
    const limit = feedListDto?.limit;
    const offset = (page - 1) * limit;

    const feeds = this.feedRepository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.user', 'user')
      .leftJoinAndSelect('feed.tags', 'tags')
      .where('user.delYn = :delYn', { delYn: YN.N })
      .andWhere('feed.displayYn = :displayYn', { displayYn: YN.Y })
      .andWhere('feed.status = :status', { status: FEED_STATUS.ACTIVE })
      .orderBy('feed.createdAt', 'DESC');

    const filteredFeeds: Feed[] = (await feeds.getMany()).filter((feed) =>
      feed.tags.some((tag) => tag.tagName === feedListDto.tagName),
    );

    const paginatedFeeds = filteredFeeds.slice(offset, offset + limit);

    const [items, totalCount] = [paginatedFeeds, filteredFeeds.length];

    const lasPage = Math.ceil(totalCount / limit);

    for (const item of filteredFeeds) {
      item.feedImages = await FeedImage.createQueryBuilder('feedImage')
        .where('feedImage.feedId = :feedId', { feedId: item.id })
        .getMany();

      // * 좋아요 체크 여부
      if (user.id) {
        const liked = await FeedLike.createQueryBuilder('feedLike')
          .where('feedLike.feedId = :feedId', { feedId: item.id })
          .andWhere('feedLike.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.likedYn = true;
        } else {
          item.likedYn = false;
        }
      }

      // * 북마크 체크 여부
      if (user.id) {
        const liked = await FeedBookmark.createQueryBuilder('feedBookmark')
          .where('feedBookmark.feedId = :feedId', { feedId: item.id })
          .andWhere('feedBookmark.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.bookmarkedYn = true;
        } else {
          item.bookmarkedYn = false;
        }
      }
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
   * 전체 피드 목록 (내가 작성한 피드 및 내가 팔로잉한 유저의 피드)
   * @returns
   */
  public async findAllByFollowing(
    user: User,
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
      .where('feed.userId IN (:...userId)', {
        userId: [...user.followingIds, user.id],
      })
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .andWhere('feed.displayYn = :displayYn', { displayYn: YN.Y })
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

      // * 좋아요 체크 여부
      if (user.id) {
        const liked = await FeedLike.createQueryBuilder('feedLike')
          .where('feedLike.feedId = :feedId', { feedId: item.id })
          .andWhere('feedLike.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.likedYn = true;
        } else {
          item.likedYn = false;
        }
      }

      // * 북마크 체크 여부
      if (user.id) {
        const liked = await FeedBookmark.createQueryBuilder('feedBookmark')
          .where('feedBookmark.feedId = :feedId', { feedId: item.id })
          .andWhere('feedBookmark.userId = :userId', {
            userId: user.id,
          })
          .getOne();
        if (liked) {
          item.bookmarkedYn = true;
        } else {
          item.bookmarkedYn = false;
        }
      }

      // TODO: 좋아오 유저
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
        'user.feedCount',
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
   * 유저별 피드 목록
   * @param userId
   * @returns
   */
  public async findAllByBookmark(
    userId: number,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const page = feedListDto?.page;
    const limit = feedListDto?.limit;
    const offset = (page - 1) * limit;

    const feeds = FeedBookmark.createQueryBuilder('feedBookmark')
      .leftJoinAndSelect('feedBookmark.feed', 'feed')
      .where('feed.displayYn = :displayYn', { displayYn: YN.Y })
      .andWhere('feed.status = :status', { status: FEED_STATUS.ACTIVE })
      .andWhere('feedBookmark.userId = :userId', { userId: userId })
      .orderBy('feed.createdAt', ORDER_BY_VALUE.DESC)
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await feeds.getManyAndCount();
    const lasPage = Math.ceil(totalCount / limit);

    for (const item of items) {
      item.feed.feedImages = await FeedImage.createQueryBuilder('feedImage')
        .where('feedImage.feedId = :feedId', { feedId: item.feedId })
        .getMany();
    }

    return {
      items: items.map((item) => item.feed),
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
      .where('feed.id = :id', { id: id })
      .getOne();

    feed.feedImages = await FeedImage.createQueryBuilder('feedImage')
      .where('feedImage.feedId = :feedId', { feedId: feed.id })
      .getMany();

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
      // * feed image  생성
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
      // * user feed count 증가
      let user = await this.userRepository.findOne({
        where: { id: userId },
      });

      user.feedCount++;
      user = await transaction.save(user);

      // * tagNames 배열 체크 후 FEED TAG MAPPER 테이블 생성
      if (feedCreateDto.tagNames && feedCreateDto.tagNames.length > 0) {
        await Promise.all(
          feedCreateDto.tagNames.map(async (tagName) => {
            // * Tag 테이블에서 해당 태그 검색
            let tag = await Tag.findOne({
              where: {
                tagName,
              },
            });

            // * 존재하는 태그 가 없을 경우 TAG 테이블에 새로 생성
            if (!tag) {
              tag = new Tag({
                tagName,
              });
              await transaction.save(tag);
            }

            // * FEED ID 와 TAG ID MAPPER 생성
            const newMapper = new MapperFeedTag({
              feedId: newFeed.id,
              tagId: tag.id,
            });
            await transaction.save(newMapper);
          }),
        );
      }

      return newFeed;
    });

    return feed;
  }

  /** 피드 좋아요 */
  public async likeFeed(userId: number, feedId: number) {
    await dataSource.transaction(async (transaction) => {
      let newLike = new FeedLike().set({
        feedId,
        userId,
      });
      newLike = await transaction.save(newLike);

      let feed = await this.findOneFeed(feedId);
      feed.likeCount++;
      feed = await transaction.save(feed);
    });
  }

  /** 피드 북마크 */
  public async bookmarkFeed(userId: number, feedId: number) {
    await dataSource.transaction(async (transaction) => {
      let newLike = new FeedBookmark().set({
        feedId,
        userId,
      });
      newLike = await transaction.save(newLike);
    });
  }

  // UPDATE

  /**
   *  피드 수정
   * @param feedId
   * @param feedUpdateDto
   * @returns Feed
   */
  public async updateFeed(
    feedId: number,
    feedUpdateDto: FeedUpdateDto,
  ): Promise<FeedFindOneVo> {
    const feed = await dataSource.transaction(async (transaction) => {
      let feed = await this.findOneFeed(feedId);
      // TODO: 기존 이미지 삭제하기

      // TODO: 새로운 이미지 추가하기
      // if (
      //   feedUpdateDto.newFeedImages &&
      //   feedUpdateDto.newFeedImages.length > 0
      // ) {
      //   await Promise.all(
      //     feedUpdateDto.newFeedImages.map(async (image) => {
      //       let newImage = new FeedImage().set({
      //         feedId: feed.id,
      //         image: image.image,
      //         sortOrder: image.sortOrder,
      //       });
      //       newImage = await transaction.save(newImage);
      //     }),
      //   );
      //   feedUpdateDto.feedImages = [
      //     ...feedUpdateDto.feedImages,
      //     ...feedUpdateDto.newFeedImages,
      //   ];
      // }
      feed.description = feedUpdateDto.description;
      // feed.feedImages = feedUpdateDto.feedImages;
      feed.updatedAt = new Date();
      feed = await transaction.save(feed);
      return feed;
    });

    return feed;
  }

  /**
   *  피드 삭제 (FEED STATUS => DELETED)
   * @param feedId
   * @returns Feed
   */
  public async deleteFeed(feedId: number): Promise<FeedFindOneVo> {
    let feed = await this.feedRepository.findOne({
      where: {
        id: feedId,
      },
    });
    feed.status = FEED_STATUS.DELETED;
    feed = await this.feedRepository.save(feed);
    return feed;
  }

  /**
   * 피드 영구 삭제
   * @param userId
   * @param feedId
   */
  public async hardDeleteFeed(userId: number, feedId: number) {
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

  /** 피드 좋아요 해제 */
  public async deleteLikeFeed(userId: number, feedId: number) {
    await dataSource.transaction(async (transaction) => {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(FeedLike)
        .where('feedId = :feedId', { feedId: feedId })
        .andWhere('userId = :userId', { userId: userId })
        .execute();

      let feed = await this.findOneFeed(feedId);
      feed.likeCount--;
      feed = await transaction.save(feed);
    });
  }

  /** 피드 북마크 해제 */
  public async deleteBookmarkFeed(userId: number, feedId: number) {
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(FeedBookmark)
      .where('feedId = :feedId', { feedId: feedId })
      .andWhere('userId = :userId', { userId: userId })
      .execute();
  }
}
