import { Module } from '@nestjs/common';

import { StudysessionService } from './studysession.service';
import { StudysessionController } from './studysession.controller';

@Module({
  imports: [],
  controllers: [StudysessionController],
  providers: [StudysessionService],
})
export class StudysessionModule {}
