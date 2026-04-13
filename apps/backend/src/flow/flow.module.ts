import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [DrizzleModule],
  controllers: [FlowController],
  providers: [FlowService],
})
export class FlowModule {}
