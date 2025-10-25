import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { CreateStudysetDto } from '../studyset/studyset.dto';
import { CreateClassroomDto } from './classroom.dto';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomservice: ClassroomService) {}
  @Get(':id')
  getClassroomById(@Param('id') id: string) {
    return 'not yet implemented';
  }

  @Get(':id/sets')
  getStudysetsFromClassroom(@Param('id') id: string) {
    return `This action returns all studysets from classroom #${id}`;
  }

  @Get(':id/sets/:set_id')
  getStudysetByIdFromClassroom(
    @Param('id') id: string,
    @Param('set_id') set_id: string,
  ) {
    return `This action returns studyset #${set_id} from classroom #${id}`;
  }

  @Get(':id/users')
  getUsersFromClassroom(@Param('id') id: string) {
    return `This action returns users from classroom #${id}`;
  }
  @Get(':id/users/:user_id')
  getUserByIdFromClassroom(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
  ) {
    return `This action returns user #${user_id} from classroom #${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createClassroom(@Body() classroom: CreateClassroomDto) {
    return `This action creates a new classroom with name${classroom.name}`;
  }

  @Patch(':id')
  updateClassroomById(@Param('id') id: string) {
    return `This action updates classroom #${id}`;
  }

  @Delete(':id')
  deleteClassroom(@Param('id') id: string) {
    return `This action deletes classroom #${id}`;
  }
}
