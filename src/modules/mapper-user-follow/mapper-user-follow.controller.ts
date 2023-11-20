import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MapperUserFollowService } from './mapper-user-follow.service';
import { ApiTags } from '@nestjs/swagger';
import {
  MapperUserFollowCreateDto,
  MapperUserFollowDeleteDto,
  MapperUserFollowListDto,
} from './dto';
import { MapperUserFollow } from './mapper-user-follow.entity';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { FollowFindOneVo } from './vo';
import { UserFindOneVo } from '../user/vo';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';

@Controller()
@ApiTags('MPPAER USER FOLLOW')
@UseGuards(new UserGuard())
export class MapperUserFollowController {
  constructor(
    private readonly mapperUserFollowService: MapperUserFollowService,
  ) {}

  @Get('/user/:username/followings')
  @HttpCode(HttpStatus.OK)
  async findAllFollowings(
    @UserInfo() user: User,
    @Param('username') username: string,
    @Query() mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<UserFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<UserFindOneVo>>(
      await this.mapperUserFollowService.findAllByFollowings(
        user,
        username,
        mapperUserfollowListDto,
      ),
    );
  }

  @Get('/user/:username/followers')
  @HttpCode(HttpStatus.OK)
  async findAllFollowers(
    @UserInfo() user: User,
    @Param('username') username: string,
    @Query() mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<FollowFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<FollowFindOneVo>>(
      await this.mapperUserFollowService.findAllByFollowers(
        user,
        username,
        mapperUserfollowListDto,
      ),
    );
  }

  @Post('follow')
  @HttpCode(HttpStatus.CREATED)
  async createMapperUserFollow(
    @Body() mapperUserFollowCreateDto: MapperUserFollowCreateDto,
  ): Promise<MapperUserFollow> {
    return await this.mapperUserFollowService.createMapperUserFollow(
      mapperUserFollowCreateDto,
    );
  }

  @Delete('unfollow')
  @HttpCode(HttpStatus.OK)
  async deleteMapperUserFollow(
    @Body() mapperUserFollowDeleteDto: MapperUserFollowDeleteDto,
  ) {
    return await this.mapperUserFollowService.deleteMapperUserFollow(
      mapperUserFollowDeleteDto,
    );
  }
}
