import { Module } from '@nestjs/common';
import { userBlockProviders } from './user-block.provider';
import { UserBlockRepository } from './user-block.repository';
import { DatabaseModule } from 'src/config';
import { UserBlockService } from './user-block.service';
import { UserBlockController } from './user-block.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [UserBlockController],
  providers: [...userBlockProviders, UserBlockRepository, UserBlockService],
  exports: [UserBlockModule, UserBlockRepository, UserBlockService],
})
export class UserBlockModule {}
