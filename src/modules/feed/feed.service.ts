import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { FeedFindOneVo } from './vo';
import { UserRepository } from '../user/user.repository';
import { DB_CONST_REPOSITORY } from 'src/config';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // GET SERVICES

  public async findAll(): Promise<FeedFindOneVo[]> {
    const feeds = await this.feedRepository.findAll();
    if (!feeds) throw new NotFoundException();
    return feeds;
  }

  public async findAllByUser(username: string): Promise<FeedFindOneVo[]> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new NotFoundException();
    console.log(user);

    const feeds = await this.feedRepository.findAllByUser(user.id);
    if (!feeds) throw new NotFoundException();
    return feeds;
  }

  /**
   *
   * @param id
   * @returns FeedFindOneVo
   */
  public async findOne(id: number): Promise<FeedFindOneVo> {
    const feed = await this.feedRepository.findOneFeed(id);
    if (!feed) throw new NotFoundException();
    return feed;
  }

  // INSERT SERVICES
}
