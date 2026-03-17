import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { StudoprofileController } from './studoprofile.controller';
import { StudoprofileService } from './studoprofile.service';

@Module({
  imports: [DrizzleModule],
  controllers: [StudoprofileController],
  providers: [StudoprofileService],
})
export class StudoprofileModule {}
