import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as types from '@studo/types';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
    // wat je JWT ook bevat
  };
}

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Post()
  async createNewCourse(
    @Body() body: types.CreateCourse,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.FullCourseResponse> {
    return this.courseService.createCourse(body, req.user.id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  async getAllUserCourses(
    @Request() req: AuthenticatedRequest,
  ): Promise<types.Course[]> {
    return this.courseService.getAllUserCourses(req.user.id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':course_id')
  async getCourseById(
    @Param('course_id', ParseUUIDPipe) course_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.FullCourseResponse> {
    return this.courseService.getFullCourse(course_id, req.user.id);
  }
}
