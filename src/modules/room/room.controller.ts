import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { BaseResponseVo, UserGuard } from 'src/core';
import { RoomCreateDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RoomFindOneVo } from './vo';

@Controller('room')
@ApiTags('ROOM')
@UseGuards(new UserGuard())
export class RoomController {
  constructor(private roomService: RoomService) {}

  /**
   * 유저별 전체 룸
   * @param user
   * @returns
   */
  @Get()
  async findAllByUser(@UserInfo() user: User) {
    return new BaseResponseVo<RoomFindOneVo[]>(
      await this.roomService.findAllByUser(user.id),
    );
  }

  /**
   * 룸 정보
   * @param roomUniqueId
   * @returns
   */
  @Get(':roomUniqueId')
  async findOneByRoomUniqueId(
    @Param('roomUniqueId') roomUniqueId: string,
  ): Promise<BaseResponseVo<RoomFindOneVo>> {
    return new BaseResponseVo<RoomFindOneVo>(
      await this.roomService.findOneByRoomUniqueId(roomUniqueId),
    );
  }
}
