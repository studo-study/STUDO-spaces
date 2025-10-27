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
  Put,
} from '@nestjs/common';
import {
  CreateStudysetDto,
  StudysetResponseDto,
} from '../studyset/studyset.dto';
import {
  ClassroomSetDto,
  ClassroomUserResponseDto,
  CreateClassroomDto,
  CreateClassroomSetDto,
  CreateClassroomUserDto,
  UpdateClassroomDto,
} from './classroom.dto';
import { ClassroomService } from './classroom.service';
import { UserResponseDto } from '../user/users.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classService: ClassroomService) {}

  //OPHALEN VAN CLASSROOM-DATA
  //alle klassen ophalen
  @Get()
  getAllClassrooms() {
    return this.classService.getAll();
  }

  //één specifieke classroom ophalen
  @Get(':classroom_id')
  getClassroomById(@Param('classroom_id') id: string) {
    return this.classService.getById(id);
  }

  //all studysets van een classroom ophalen
  @Get(':classroom_id/sets')
  getStudysetsFromClassroom(@Param('classroom_id') classroom_id: string) {
    return this.classService.getSetsById(classroom_id);
  }

  //alle gejoinde users van een classroom ophalen
  @Get(':classroom_id/users')
  getUsersFromClassroom(@Param('classroom_id') classroom_id: string) {
    return this.classService.getUsers(classroom_id);
  }

  //CREËEREN VAN CLASSROOM
  //classroom aanmaken
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createClassroom(@Body() classroom: CreateClassroomDto) {
    return this.classService.create(classroom);
  }

  //set toevoegen aan classroom
  @Post(':classroom_id/sets')
  @HttpCode(HttpStatus.CREATED)
  createClassroomSet(@Body() set: CreateClassroomSetDto) {
    return this.classService.add(set);
  }

  //user toevoegen aan classroom
  @Post(':classroom_id/users')
  @HttpCode(HttpStatus.CREATED)
  joinClassroom(@Body() user: CreateClassroomUserDto) {
    return this.classService.join(user);
  }

  //UPDATEN
  //classroom updaten
  @Put(':classroom_id')
  updateClassroomById(
    @Param('classroom_id') classroom_id: string,
    @Body() set: UpdateClassroomDto,
  ) {
    return this.classService.updateById(classroom_id, set);
  }

  //DELETEN
  //classroom verwijderen
  @Delete(':classroom_id')
  deleteClassroom(@Param('id') id: string) {
    return this.classService.deleteById(id);
  }

  //classroom_user verwijderen
  @Delete(':classroom_id/users/:id')
  @HttpCode(HttpStatus.GONE)
  leaveClassroom(@Body() user: ClassroomUserResponseDto) {
    return this.classService.leave(user);
  }

  //classroom_set verwijderen
  @Delete(':classroom_id/sets/:set_id')
  @HttpCode(HttpStatus.GONE)
  removeSetClassroom(@Body() set: ClassroomSetDto) {
    return this.classService.remove(set);
  }
}
