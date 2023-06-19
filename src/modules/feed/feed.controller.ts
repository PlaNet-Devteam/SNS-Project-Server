import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { FeedCreateDto } from './dto';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { BaseResponseVo, UserGuard } from 'src/core';
import { FeedFindOneVo } from './vo';

@Controller('feed')
@ApiTags('FEED')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET ENDPOINTS
  /**
   * 피드 목록
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getFeeds(): Promise<BaseResponseVo<FeedFindOneVo[]>> {
    return new BaseResponseVo<FeedFindOneVo[]>(
      await this.feedService.findAll(),
    );
  }

  // POST ENDPOINTS

  /**
   * 새로운 피드 생성
   * @param feedCreateDto
   * @returns null
   */
  @UseGuards(new UserGuard())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createFeed(
    @UserInfo() user: User,
    @Body() feedCreateDto: FeedCreateDto,
  ) {
    return await this.feedService.createFeed(user.id, feedCreateDto);
  }
}
