import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { CacheConfigService } from './index.cache.config.service';

@Module({
  imports: [
    ClusterModule.forRootAsync({
      useClass: CacheConfigService,
    }),
  ],
})
export class CacheClusterModule {}
