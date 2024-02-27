import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserSocialService } from './user-social.service';
import { UserSocialFindOneVo } from './vo';
import { BaseResponseVo } from 'src/core';
import { UserSocialCreateDto } from './dto';

@Controller('user-social')
@ApiTags('USER SOCIAL')
export class UserSocialController {
  constructor(private readonly userSocialService: UserSocialService) {}

  /**
   * 아이디로 상세 호출
   * @param id
   * @returns
   */
  @Get(':id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseVo<UserSocialFindOneVo>> {
    return new BaseResponseVo<UserSocialFindOneVo>(
      await this.userSocialService.findOne(id),
    );
  }

  // POST ENDPOINTS

  /**
   * 새로운 사용자 생성
   * @param userCreateDto
   * @returns null
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(@Body() userCreateDto: UserSocialCreateDto) {
    return await this.userSocialService.createUser(userCreateDto);
  }
}
