import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost', // docker service name
      port: Number(process.env.REDIS_PORT || 6379),

      lazyConnect: true, // ⚠️ app yiqilmasin 
      retryStrategy(times) {
        if (times > 5) {
          console.error('❌ Redis reconnect stopped');
          return null; // reconnectni to‘xtat
        } 
        return Math.min(times * 300, 3000);
      },
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err.message);
    });

    // qo‘lda connect
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, seconds: number) {
    return this.client.set(key, value, 'EX', seconds);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
