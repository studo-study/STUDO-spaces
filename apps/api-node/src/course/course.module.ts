import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [DrizzleModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
