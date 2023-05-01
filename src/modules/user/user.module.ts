import { Module } from '@nestjs/common';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from '../auth/hash.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...userProviders, UserRepository, UserService, HashService],
  exports: [UserModule, UserRepository, UserService],
})
export class UserModule {}
