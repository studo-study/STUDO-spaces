import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { SvenController } from './sven.controller';
import { SvenService } from './sven.service';

@Module({
  imports: [DrizzleModule],
  controllers: [SvenController],
  providers: [SvenService],
})
export class SvenModule {}
