import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as types from '@studo/types';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Post()
  async createNewCourse(
    @Body() body: types.CreateCourse,
  ): Promise<types.FullCourseResponse> {
    return this.courseService.createCourse(body);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id')
  async getAllUserCourses(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<types.Course[]> {
    return this.courseService.getAllUserCourses(user_id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id/:course_id')
  async getCourseById(
    @Param('course_id', ParseUUIDPipe) course_id: string,
  ): Promise<types.FullCourseResponse> {
    return this.courseService.getFullCourse(course_id);
  }
}
