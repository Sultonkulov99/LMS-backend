import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Injectable()
export class CacheModuleConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions<any>> {
    return {
      store: await redisStore({
        password: this.configService.getOrThrow('REDIS_PASSWORD'),
        host: this.configService.getOrThrow('REDIS_HOST'),
        port: +this.configService.getOrThrow('REDIS_PORT'),
        db: +this.configService.getOrThrow('REDIS_DB') || 0,
      }),
    };
  }
}
