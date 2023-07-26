import {
  Body,
  Controller,
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
import { FeedCreateDto, FeedListDto } from './dto';

@UseGuards(new UserGuard())
@Controller('feed')
@ApiTags('FEED')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET ENDPOINTS

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Query() feedListDto: FeedListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>> {
    console.log('feedListDto', feedListDto);
    return new BaseResponseVo<PaginateResponseVo<FeedFindOneVo>>(
      await this.feedService.findAll(feedListDto),
    );
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  public async findAllByUser(
    @UserInfo() user: User,
    @Param('username') username: string,
  ): Promise<BaseResponseVo<FeedFindOneVo[]>> {
    return new BaseResponseVo<FeedFindOneVo[]>(
      await this.feedService.findAllByUser(username),
    );
  }

  /**
   * 피드아이디로 상세 호출
   * @param id
   * @returns
   */

  @Get(':id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOneFeed(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseVo<FeedFindOneVo>> {
    return new BaseResponseVo<FeedFindOneVo>(
      await this.feedService.findOne(id),
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
  ): Promise<Feed> {
    return await this.feedService.createFeed(user.id, feedCreateDto);
  }
}
