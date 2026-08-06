/// <reference types="multer" />
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as types from '@studo/types';
import { Request as ExpressRequest } from 'express';
import { FileService } from './file.service';

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
  constructor(
    private readonly courseService: CourseService,
    private readonly fileService: FileService,
  ) {}

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

  @Roles(Role.USER, Role.ADMIN)
  @Post('/course-upload')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: { fileSize: 30 * 1024 * 1024 }, // 30 mb
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.match(
            /(pdf|officedocument\.wordprocessingml\.document|officedocument\.spreadsheetml\.sheet)$/,
          )
        ) {
          return cb(new Error('This file is not allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDocuments(
    @Body('courseId') courseId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: AuthenticatedRequest,
  ) {
    return this.fileService.upload(courseId, files, req.user.id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':course_id/docs/:doc_id')
  async getDocument(
    @Param('course_id', ParseUUIDPipe) courseId: string,
    @Param('doc_id', ParseUUIDPipe) docId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.fileService.getDocument(courseId, docId, req.user.id);
  }
}
