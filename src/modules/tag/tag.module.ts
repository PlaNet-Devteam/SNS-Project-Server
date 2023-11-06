import { Module } from '@nestjs/common';
import { tagProviders } from './tag.provider';
import { TagRepository } from './tag.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TagController],
  providers: [...tagProviders, TagRepository, TagService],
  exports: [TagModule, TagRepository, TagService],
})
export class TagModule {}
