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
import { MessageService } from './message.service';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { BaseResponseVo, UserGuard } from 'src/core';
import { MessageCreateDto, MessageListCreateDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { MessageFindOneVo } from './vo';

@Controller()
@ApiTags('MESSAGE')
@UseGuards(new UserGuard())
export class MessageController {
  constructor(private messageService: MessageService) {}

  /**
   * 룸 아이디 별 메세지
   * @param roomUniqueId
   * @returns
   */
  @Get('room/:roomUniqueId/message')
  async findAll(
    @Param('roomUniqueId') roomUniqueId: string,
  ): Promise<BaseResponseVo<MessageFindOneVo[]>> {
    return new BaseResponseVo<MessageFindOneVo[]>(
      await this.messageService.findAll(roomUniqueId),
    );
  }

  /**
   * 메세지 전송
   * @param messageListCreateDto
   * @returns
   */
  @Post('message')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() messageListCreateDto: MessageListCreateDto) {
    return await this.messageService.createMessage(messageListCreateDto);
  }
}
