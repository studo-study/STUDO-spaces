import { Module } from '@nestjs/common';
import { VisualsetController } from './visualset.controller';
import { VisualsetService } from './visualset.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ScalewayStorageService } from '../scaleway/scaleway-storage.service';

@Module({
  imports: [DrizzleModule],
  controllers: [VisualsetController],
  providers: [VisualsetService, ScalewayStorageService],
})
export class VisualsetModule {}
