import { Injectable } from '@nestjs/common';
import { FeedCreateDto } from './dto';
import { FeedRepository } from './feed.repository';
import { FeedFindOneVo } from './vo';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  //
  public async findAll(): Promise<FeedFindOneVo[]> {
    return await this.feedRepository.findAll();
  }

  // INSERT SERVICES

  /**
   * 새로운 피드 생성
   * @param userId
   * @param feedCreateDto
   */
  public async createFeed(userId: number, feedCreateDto: FeedCreateDto) {
    await this.feedRepository.createFeed(userId, feedCreateDto);
  }
}
