import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Brackets, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { dataSource } from '../../config';
import { TagCreateDto, TagListDto } from './dto';
import { ORDER_BY_VALUE, YN } from 'src/common';
import { PaginateResponseVo } from 'src/core';
import { TagFindOneVo } from './vo';

@Injectable()
export class TagRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.TAG)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  // SELECTS

  /**
   * 전체 태그
   * @param tagListDto
   * @returns
   */
  public async findAll(
    tagListDto?: TagListDto,
  ): Promise<PaginateResponseVo<TagFindOneVo>> {
    const page = tagListDto?.page;
    const limit = tagListDto?.limit;
    const offset = (page - 1) * limit;

    const tags = this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.tagName LIKE :query', { query: `%${tagListDto.query}%` })
      .andWhere('tag.searchYn = :searchYn', { searchYn: YN.Y })
      .orderBy('tag.createdAt', ORDER_BY_VALUE.ASC)
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await tags.getManyAndCount();
    const lasPage = Math.ceil(totalCount / limit);

    return {
      items: items,
      totalCount: totalCount,
      pageInfo: {
        page,
        limit,
        isLast: page === lasPage ? true : false,
      },
    };
  }

  /**
   * 태그명으로 찾기
   * @param tagName
   * @returns
   */
  public async findOneByTagName(tagName: string): Promise<TagFindOneVo> {
    const tag = await this.tagRepository.findOne({
      where: {
        tagName,
      },
    });
    return tag;
  }

  // INSERTS

  /**
   * 태그 생성
   * @param tagCreateDto
   * @returns Tag
   */
  public async createTag(tagCreateDto: TagCreateDto): Promise<TagFindOneVo> {
    const tag = await dataSource.transaction(async (transaction) => {
      let newTag = new Tag(tagCreateDto);
      newTag = await transaction.save(newTag);

      return newTag;
    });

    return tag;
  }
}
