import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HashService } from '../auth/hash.service';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { User } from './user.entity';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [...userProviders, UserRepository, UserService, HashService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('check if service runs', () => {
    expect(userService).toBeDefined();
  });
});
