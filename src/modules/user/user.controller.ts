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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserFindOneVo } from './vo';
import { UserCreateDto, UserUpdateDto, UserUpdateStatusDto } from './dto';
import { BaseResponseVo, UserGuard } from 'src/core';
import { UserInfo } from 'src/common';
import { User } from './user.entity';
import { UserDeleteDto } from './dto/user-delete.dto';

@Controller('user')
@ApiTags('USER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 아이디로 상세 호출
   * @param id
   * @returns
   */
  @Get(':id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOneUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseVo<UserFindOneVo>> {
    return new BaseResponseVo<UserFindOneVo>(
      await this.userService.findOne(id),
    );
  }

  /**
   * 사용자명으로 상세 호출
   * @param id
   * @returns
   */
  @Get('username/:username')
  @HttpCode(HttpStatus.OK)
  public async findOneUserByUsername(
    @Param('username') username: string,
  ): Promise<BaseResponseVo<UserFindOneVo>> {
    return new BaseResponseVo<UserFindOneVo>(
      await this.userService.findUserByUsername(username),
    );
  }

  /**
   * 본인 찾기
   * @param user
   * @returns UserFindOneVo
   */
  @Get('find-me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async findMe(
    @UserInfo() user: User,
  ): Promise<BaseResponseVo<UserFindOneVo>> {
    return new BaseResponseVo<UserFindOneVo>(
      await this.userService.findOne(user.id),
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
  public async createUser(@Body() userCreateDto: UserCreateDto) {
    return await this.userService.createUser(userCreateDto);
  }

  /**
   *  사용자 정보 수정
   */
  @Patch(':id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return await this.userService.updateUser(id, userUpdateDto);
  }

  /**
   *  사용자 상태 수정
   * @param user
   * @param userUpdateStatusDto
   * @returns
   */
  @Patch('status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async updateUserStatus(
    @UserInfo() user: User,
    @Body() userUpdateStatusDto: UserUpdateStatusDto,
  ) {
    return await this.userService.updateUserStatus(
      user.id,
      userUpdateStatusDto,
    );
  }

  /**
   *  계정 활성화
   * @param user
   * @param userUpdateStatusDto
   * @returns
   */
  @Patch('activate-account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async activateUser(@UserInfo() user: User) {
    return await this.userService.activateUser(user.id);
  }

  /**
   * 계정 삭제
   * @param user
   * @param userDeleteDto
   * @returns
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(new UserGuard())
  public async deleteUser(
    @UserInfo() user: User,
    @Body() userDeleteDto: UserDeleteDto,
  ) {
    return await this.userService.deleteUser(user.id, userDeleteDto);
  }

  @Get('users')
  findAllUsers() {
    return this.userService.findAllUsers();
  }
}
