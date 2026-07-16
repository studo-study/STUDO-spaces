import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Course, FullCourseResponse } from '@studo/types';

@ApiTags('course')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(Role.USER)
  @Get(':user_id')
  async getAllUserCourses(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<Course[]> {
    return this.courseService.getAllUserCourses(user_id);
  }

  @Roles(Role.USER)
  @Get(':user_id/:course_id')
  async getCourseById(
    @Param('course_id', ParseUUIDPipe) course_id: string,
  ): Promise<FullCourseResponse> {
    return this.courseService.getFullCourse(course_id);
  }
}
