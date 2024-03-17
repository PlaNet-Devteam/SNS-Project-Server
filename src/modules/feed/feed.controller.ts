import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { Feed } from './feed.entity';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { FeedFindOneVo } from './vo';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import {
  FeedCreateDto,
  FeedListDto,
  FeedUpdateDto,
  FeedUpdateStatusDto,
} from './dto';

@Controller()
@ApiTags('FEED')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET ENDPOINTS

  @Get('/feed')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async findAll(
    @UserInfo() user: User,
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAll(user, feedListDto),
    );
  }

  @Get('/feed/tag')
  @HttpCode(HttpStatus.OK)
  public async findAllByTag(
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAllByTag(feedListDto),
    );
  }

  @Get('/feed/following')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async findAllByFollowing(
    @UserInfo() user: User,
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAllByFollowing(user, feedListDto),
    );
  }

  @Get('/feed/user/:username')
  @HttpCode(HttpStatus.OK)
  public async findAllByUser(
    @Param('username') username: string,
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<FeedFindOneVo[]>> {
    return new BaseResponseVo<FeedFindOneVo[]>(
      await this.feedService.findAllByUser(username, feedListDto),
    );
  }

  /**
   * 피드 북마크 목록
   * @param user
   * @param feedListDto
   * @returns
   */
  @Get('/feed/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async findAllByBookmark(
    @UserInfo() user: User,
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAllByBookmark(user, feedListDto),
    );
  }

  /**
   * 피드아이디로 상세 호출
   * @param id
   * @returns
   */

  @Get('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOneFeed(@Param('id', ParseIntPipe) id: number) {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.findOneByUser(id),
    );
  }

  // POST ENDPOINTS

  /**
   * 새로운 피드 생성
   * @param feedCreateDto
   * @returns Feed
   */
  @Post('/feed')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(new UserGuard())
  public async createFeed(
    @UserInfo() user: User,
    @Body() feedCreateDto: FeedCreateDto,
  ): Promise<Feed> {
    return await this.feedService.createFeed(user.id, feedCreateDto);
  }

  /**
   * 피드 좋아요
   * @param user
   * @param id
   * @returns
   */
  @Post('/feed/:id([0-9]+)/like')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(new UserGuard())
  public async likeFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.likeFeed(user.id, id);
  }

  /**
   * 피드 좋아요
   * @param user
   * @param id
   * @returns
   */
  @Post('/feed/:id([0-9]+)/bookmark')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(new UserGuard())
  public async bookmarkFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.bookmarkFeed(user.id, id);
  }

  // PATCH ENDPOINTS

  /**
   * 피드 업데이트
   * @param feedUpdateDto
   * @returns Feed
   */
  @Patch('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async updateFeed(
    @Param('id', ParseIntPipe) id: number,
    @Body() feedUpdateDto: FeedUpdateDto,
  ): Promise<BaseResponseVo<FeedFindOneVo>> {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.updateFeed(id, feedUpdateDto),
    );
  }

  /**
   * 피드 상태 업데이트
   * @param feedUpdateStatusDto
   * @returns Feed
   */
  @Patch('/feed/:id([0-9]+)/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async updateFeedStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() feedUpdateStatusDto: FeedUpdateStatusDto,
  ): Promise<BaseResponseVo<FeedFindOneVo>> {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.updateFeedStatus(id, feedUpdateStatusDto),
    );
  }

  /**
   * 피드 좋아요 수 노출 상태 업데이트
   * @param feedUpdateStatusDto
   * @returns Feed
   */
  @Patch('/feed/:id([0-9]+)/show-like-count')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async updateShowLikeCount(
    @Param('id', ParseIntPipe) id: number,
    @Body() feedUpdateStatusDto: FeedUpdateStatusDto,
  ): Promise<BaseResponseVo<FeedFindOneVo>> {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.updateShowLikeCount(id, feedUpdateStatusDto),
    );
  }

  // DELETE ENDPOINTS

  /**
   * 피드 삭제
   * @param user
   * @param id
   * @returns
   */
  @Delete('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async deleteFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.deleteFeed(user.id, id);
  }

  /**
   * 피드 이미지 삭제
   * @param user
   * @param id
   * @returns
   */
  @Delete('/feed/:id([0-9]+)/image/:sortOrder([0-9]+)')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async deleteFeedImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('sortOrder', ParseIntPipe) sortOrder: number,
  ) {
    return await this.feedService.deleteFeedImage(id, sortOrder);
  }

  /**
   * 피드 좋아요 해제
   * @param user
   * @param id
   * @returns
   */
  @Delete('/feed/:id([0-9]+)/like')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async deleteLikeFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.deleteLikeFeed(user.id, id);
  }

  /**
   * 피드 좋아요 해제
   * @param user
   * @param id
   * @returns
   */
  @Delete('/feed/:id([0-9]+)/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async deleteBookmarkFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.deleteBookmarkFeed(user.id, id);
  }
}
