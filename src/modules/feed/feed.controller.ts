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
import { FeedCreateDto, FeedListDto, FeedUpdateDto } from './dto';

@Controller()
@ApiTags('FEED')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET ENDPOINTS

  @Get('/feed')
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    console.log('feedListDto', feedListDto);
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAll(feedListDto),
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
   * 피드아이디로 상세 호출
   * @param id
   * @returns
   */

  @Get('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOneFeed(@Param('id', ParseIntPipe) id: number) {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.findOne(id),
    );
  }

  // POST ENDPOINTS

  /**
   * 새로운 피드 생성
   * @param feedCreateDto
   * @returns Feed
   */
  @UseGuards(new UserGuard())
  @Post('/feed')
  @HttpCode(HttpStatus.CREATED)
  public async createFeed(
    @UserInfo() user: User,
    @Body() feedCreateDto: FeedCreateDto,
  ): Promise<Feed> {
    return await this.feedService.createFeed(user.id, feedCreateDto);
  }

  // PATCH ENDPOINTS

  /**
   * 피드 업데이트
   * @param feedUpdateDto
   * @returns Feed
   */
  @UseGuards(new UserGuard())
  @Patch('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async updateFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() feedUpdateDto: FeedUpdateDto,
  ): Promise<FeedFindOneVo> {
    return await this.feedService.updateFeed(id, feedUpdateDto);
  }

  // DELETE ENDPOINTS

  /**
   * 피드 삭제
   * @param user
   * @param id
   * @returns
   */
  @UseGuards(new UserGuard())
  @Delete('/feed/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async deleteFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.deleteFeed(user.id, id);
  }

  /** 피드 좋아요 */
  @UseGuards(new UserGuard())
  @Post('/feed/:id([0-9]+)/like')
  @HttpCode(HttpStatus.CREATED)
  public async likeFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.likeFeed(user.id, id);
  }

  /** 피드 좋아요 */
  @UseGuards(new UserGuard())
  @Delete('/feed/:id([0-9]+)/like')
  @HttpCode(HttpStatus.OK)
  public async deleteLikeFeed(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.feedService.deleteLikeFeed(user.id, id);
  }
}
