import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import SettingsController from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [DrizzleModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
