import {
  ClusterModuleOptions,
  ClusterOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService implements ClusterOptionsFactory {
  async createClusterOptions(): Promise<ClusterModuleOptions> {
    return {
      config: {
        nodes: [
          {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        ],
      },
    };
  }
}
