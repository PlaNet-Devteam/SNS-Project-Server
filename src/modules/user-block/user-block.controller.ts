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
import { UserBlockService } from './user-block.service';
import { ApiTags } from '@nestjs/swagger';
import { UserBlockCreateDto, UserBlockListDto } from './dto';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { UserBlock } from './user-block.entity';
import { UserFindOneVo } from '../user/vo';

@Controller('user-block')
@ApiTags('USER BLOCK')
@UseGuards(new UserGuard())
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @UserInfo() user: User,
    @Query() userBlockListDto: UserBlockListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<UserBlock>>> {
    return new BaseResponseVo<PaginateResponseVo<UserBlock>>(
      await this.userBlockService.findAll(user.id, userBlockListDto),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserBlock(
    @Body() UserBlockCreateDto: UserBlockCreateDto,
  ): Promise<BaseResponseVo<UserFindOneVo>> {
    return new BaseResponseVo<UserFindOneVo>(
      await this.userBlockService.createUserBlock(UserBlockCreateDto),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUserBlock(@Body() UserBlockCreateDto: UserBlockCreateDto) {
    return await this.userBlockService.deleteUserBlock(UserBlockCreateDto);
  }
}
