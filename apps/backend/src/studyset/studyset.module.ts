import { Module } from '@nestjs/common';
import { StudysetsController } from './studysets.controller';
import { StudysetService } from './studyset.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [StudysetsController],
  providers: [StudysetService],
})
export class StudysetModule {}
