import { Module } from '@nestjs/common';

import { StudysessionService } from './studysession.service';
import { StudysessionController } from './studysession.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [StudysessionController],
  providers: [StudysessionService],
})
export class StudysessionModule {}
