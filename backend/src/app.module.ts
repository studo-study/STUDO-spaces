import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudysetModule } from './studyset/studyset.module';
import { StudysessionModule } from './studysession/studysession.module';
import { ProfileModule } from './profile/profile.module';
import { FolderModule } from './folder/folder.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    StudysetModule,
    StudysessionModule,
    ProfileModule,
    FolderModule,
    ClassroomModule,
    PinModule,
    VisualsetModule,
    DrizzleModule,
    SearchModule,
    AuthModule,
    SessionModule,
    SearchModule,
    StudoprofileModule,
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
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
