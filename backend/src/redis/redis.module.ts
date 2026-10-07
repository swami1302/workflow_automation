import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        // maxRetries PerRequest must be null — BullMQ's blocking commands
        // need unlimited retries, ioredis's default (20) breaks them.
        connection: new Redis(config.get<string>('REDIS_URL')!, {
          maxRetriesPerRequest: null,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class RedisModule {}
