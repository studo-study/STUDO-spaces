import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { FileService } from './file.service';

@Module({
  imports: [DrizzleModule],
  controllers: [CourseController],
  providers: [CourseService, FileService],
})
export class CourseModule {}
