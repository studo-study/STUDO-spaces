import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [DrizzleModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
