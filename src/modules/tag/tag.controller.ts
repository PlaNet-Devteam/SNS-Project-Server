import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagFindOneVo } from './vo';
import { TagCreateDto, TagListDto } from './dto';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';

@Controller('tag')
@ApiTags('TAG')
@UseGuards(new UserGuard())
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // GET ENDPOINTS

  /**
   * 전체 태그 목록
   * @param tagListDto
   * @returns
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() tagListDto?: TagListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<TagFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<TagFindOneVo>>(
      await this.tagService.findAll(tagListDto),
    );
  }

  // POST ENDPOINTS

  /**
   * 새로운 사용자 생성
   * @param tagCreateDto
   * @returns null
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createTag(@Body() tagCreateDto: TagCreateDto) {
    return await this.tagService.createTag(tagCreateDto);
  }
}
