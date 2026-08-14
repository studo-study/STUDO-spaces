import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { FileService } from './file.service';
import { TableService } from './table.service';

@Module({
  imports: [DrizzleModule],
  controllers: [CourseController],
  providers: [CourseService, FileService, TableService],
})
export class CourseModule {}
