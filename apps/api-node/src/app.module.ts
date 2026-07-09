import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudysetModule } from './studyset/studyset.module';
import { StudysessionModule } from './studysession/studysession.module';
import { ProfileModule } from './profile/profile.module';
import { ClassroomModule } from './classroom/classroom.module';
import { PinModule } from './pin/pin.module';
import { VisualsetModule } from './visualset/visualset.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import configuration from './config/configuration';
import { SearchModule } from './search/search.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './lib/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { HealthController } from './health/health.controller';
import { StudoprofileModule } from './studoprofile/studoprofile.module';
import { SvenModule } from './sven/sven.module';
import { AdminModule } from './admin/admin.module';
import { FlowModule } from './flow/flow.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from './redis/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from './redis/redis.provider';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [REDIS_CLIENT],
      useFactory: (redis: Redis) => ({
        throttlers: [{ ttl: 60_000, limit: 100 }],
        storage: new ThrottlerStorageRedisService(redis),
      }),
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.register({ ttl: 60_000, max: 500 }),
    RedisModule,
    UserModule,
    StudysetModule,
    StudysessionModule,
    ProfileModule,
    ClassroomModule,
    PinModule,
    VisualsetModule,
    DrizzleModule,
    SearchModule,
    AuthModule,
    SessionModule,
    SearchModule,
    StudoprofileModule,
    SvenModule,
    AdminModule,
    FlowModule,
    ChatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
