import { Module } from '@nestjs/common';
import { StudysetsController } from './studysets.controller';
import { StudysetService } from './studyset.service';

@Module({
  imports: [],
  controllers: [StudysetsController],
  providers: [StudysetService],
})
export class StudysetModule {}
