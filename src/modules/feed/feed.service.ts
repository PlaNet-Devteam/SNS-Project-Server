import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { FeedFindOneVo } from './vo';
import { UserRepository } from '../user/user.repository';
import {
  FeedCreateDto,
  FeedListDto,
  FeedUpdateDto,
  FeedUpdateStatusDto,
} from './dto';
import { Feed } from './feed.entity';
import { PaginateResponseVo } from 'src/core';
import { User } from '../user/user.entity';
import { UserBlockRepository } from '../user-block/user-block.repository';
import { FeedLikeRepository } from '../feed-like/feed-like.repository';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly userRepository: UserRepository,
    private readonly userBlockRepository: UserBlockRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
  ) {}

  // GET SERVICES

  public async findAll(
    user: User,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    // * 차단한 유저 혹은 나를 차단한 유저의 피드 검색 제외
    const blockerUsers = await this.userBlockRepository.findAllByBlockerIds(
      feedListDto.viewerId,
    );
    const blockedMeUsers = await this.userBlockRepository.findAllByBlockedIds(
      feedListDto.viewerId,
    );
    const excludeUserIds = [...blockerUsers, ...blockedMeUsers];

    const feeds = await this.feedRepository.findAll(
      user,
      feedListDto,
      excludeUserIds,
    );

    if (!feeds) throw new NotFoundException();

    return feeds;
  }

  public async findAllByTag(
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const feeds = await this.feedRepository.findAllByTag(feedListDto);

    if (!feeds) throw new NotFoundException();

    return feeds;
  }

  public async findAllByFollowing(
    user: User,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const feeds = await this.feedRepository.findAllByFollowing(
      user,
      feedListDto,
    );
    if (!feeds) throw new NotFoundException();
    return feeds;
  }

  public async findAllByUser(
    username: string,
    feedListDto?: FeedListDto,
  ): Promise<PaginateResponseVo<FeedFindOneVo>> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new NotFoundException();

    if (feedListDto.viewerId) {
      // * 차단 여부 체크 => 차단된 유저의 피드 빈배열 반환
      const isBlocked = await this.userBlockRepository.checkIsBlocked(
        feedListDto.viewerId,
        user.id,
      );

      if (isBlocked) return new PaginateResponseVo<FeedFindOneVo>();
    }

    const feeds = await this.feedRepository.findAllByUser(user.id, feedListDto);

    return feeds;
  }

  public async findAllByBookmark(user: User, feedListDto?: FeedListDto) {
    const feeds = await this.feedRepository.findAllByBookmark(
      user,
      feedListDto,
    );
    if (!feeds) throw new NotFoundException();
    return feeds;
  }

  /**
   * 피드 찾기
   * @param id
   * @returns FeedFindOneVo
   */
  public async findOneFeed(id: number): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneFeed(id);
    if (!feed) throw new NotFoundException();
    return feed;
  }

  /**
   * 사용자별 피드 상세
   * @param id
   * @returns FeedFindOneVo
   */
  public async findOneByUser(user: User, id: number): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneByUser(user, id);
    if (!feed) throw new NotFoundException();
    return feed;
  }

  // INSERT SERVICES

  /**
   * 새로운 피드 생성
   * @param userId
   * @param feedCreateDto
   */
  public async createFeed(
    userId: number,
    feedCreateDto: FeedCreateDto,
  ): Promise<Feed> {
    return await this.feedRepository.createFeed(userId, feedCreateDto);
  }

  public async likeFeed(userId: number, feedId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');

    const like = await this.feedLikeRepository.findOne(userId, feedId);
    if (like) throw new NotFoundException('잘못된 요청입니다 - 좋아요 실패');

    return await this.feedRepository.likeFeed(userId, feedId);
  }

  public async bookmarkFeed(userId: number, feedId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.bookmarkFeed(userId, feedId);
  }

  // UPDATE SERVICES

  /**
   * 피드 수정
   * @param userId
   * @param feedUpdateDto
   */
  public async updateFeed(
    feedId: number,
    feedUpdateDto: FeedUpdateDto,
  ): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.updateFeed(feedId, feedUpdateDto);
  }

  /**
   * 피드 상태 수정
   * @param userId
   * @param feedUpdateDto
   */
  public async updateFeedStatus(
    feedId: number,
    feedUpdateStatusDto: FeedUpdateStatusDto,
  ): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.updateFeedStatus(
      feedId,
      feedUpdateStatusDto,
    );
  }
  /**
   * 피드 좋아요 수 노출 상태 수정
   * @param userId
   * @param feedUpdateDto
   */
  public async updateShowLikeCount(
    feedId: number,
    feedUpdateStatusDto: FeedUpdateStatusDto,
  ): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.updateShowLikeCount(
      feedId,
      feedUpdateStatusDto,
    );
  }

  // DELETE SERVICES

  /**
   * 피드 삭제 (FEED STATUS => DELETED)
   * @param userId
   */
  public async deleteFeed(userId: number, feedId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.deleteFeed(userId, feedId);
  }

  /**
   * 피드 이미지 삭제
   * @param userId
   */
  public async deleteFeedImage(feedId: number, sortOrder: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.deleteFeedImage(feedId, sortOrder);
  }

  public async deleteLikeFeed(userId: number, feedId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');

    const like = await this.feedLikeRepository.findOne(userId, feedId);
    if (!like)
      throw new NotFoundException('잘못된 요청입니다 - 좋아요 해제 실패');

    return await this.feedRepository.deleteLikeFeed(userId, feedId);
  }

  public async deleteBookmarkFeed(userId: number, feedId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException('존재하지 않는 게시물입니다');
    return await this.feedRepository.deleteBookmarkFeed(userId, feedId);
  }
}
