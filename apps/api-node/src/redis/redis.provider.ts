import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () =>
    new Redis({
      host: process.env.REDISHOST ?? 'localhost',
      port: Number(process.env.REDISPORT ?? 6379),
      password: process.env.REDISPASSWORD,
    }),
};
