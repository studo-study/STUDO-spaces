import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  ParseUUIDPipe,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ClassroomListResponseDto,
  CreateClassroomActivityDto,
  CreateClassroomDto,
  CreateClassroomSetsDto,
  CreateClassroomUserDto,
  FullClassroomResponseDto,
  UpdateClassroomDto,
} from './classroom.dto';
import { ClassroomService } from './classroom.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
    // wat je JWT ook bevat
  };
}

@ApiTags('classrooms')
@ApiBearerAuth()
@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classService: ClassroomService) {}

  //OPHALEN VAN CLASSROOM-DATA
  //alle klassen ophalen
  @ApiOperation({ summary: 'Haal alle classrooms op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle classrooms opgehaald',
    type: ClassroomListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllClassrooms(): Promise<ClassroomListResponseDto> {
    return this.classService.getAll();
  }

  @ApiOperation({ summary: 'haal alle classroooms van een user op' })
  @ApiResponse({
    status: 200,
    description: 'Alle classrooms opgehaald',
    type: ClassroomListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('user/:id')
  async getUserClassrooms(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClassroomListResponseDto> {
    return this.classService.getAllByUserId(id);
  }

  //één specifieke classroom ophalen inclusief users en sets
  @ApiOperation({
    summary: 'Haal specifieke classroom op inclusief users en sets.',
  })
  @ApiParam({ name: 'classroom_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Classroom gevonden met users en sets',
    type: FullClassroomResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':classroom_id')
  async getClassroomById(
    @Param('classroom_id', ParseUUIDPipe) id: string,
  ): Promise<FullClassroomResponseDto> {
    return this.classService.getById(id);
  }

  //all sets van een classroom ophalen
  @ApiOperation({
    summary: 'Haal alle classroomsets op uit een classrooms.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':classroom_id/sets')
  async getStudysetsFromClassroom(
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
  ) {
    return this.classService.getSetsById(classroom_id);
  }

  //alle gejoinde users van een classroom ophalen
  @ApiOperation({
    summary: 'Haal alle users op uit een classrooms.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':classroom_id/users')
  async getUsersFromClassroom(
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
  ) {
    return this.classService.getUsersById(classroom_id);
  }

  //CREËEREN VAN CLASSROOM
  //classroom aanmaken
  @ApiOperation({
    summary: 'Creëer een classroom.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createClassroom(
    @Request() req: AuthenticatedRequest,
    @Body() classroom: CreateClassroomDto,
  ) {
    const user_id = req.user.id;
    return this.classService.create(user_id, classroom);
  }

  //set toevoegen aan classroom
  @ApiOperation({
    summary: 'Voeg een set aan een classroom toe.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':classroom_id/sets/:set_id')
  @HttpCode(HttpStatus.CREATED)
  createClassroomSet(
    @Param('classroom_id', ParseUUIDPipe) classroom: string,
    @Param('set_id', ParseUUIDPipe) set_id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const user_id = req.user.id;
    return this.classService.add(classroom, set_id, user_id);
  }

  //meerdere sets toevoegen aan classroom
  @ApiOperation({
    summary: 'Voeg meerdere sets aan een classroom toe.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':classroom_id/sets/add')
  @HttpCode(HttpStatus.CREATED)
  createClassroomSets(
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
    @Body() sets: CreateClassroomSetsDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const user_id = req.user.id;
    return this.classService.addSets(classroom_id, user_id, sets);
  }

  //user toevoegen aan classroom
  @ApiOperation({
    summary: 'Voeg een user aan een classroom toe.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':classroom_id/users')
  @HttpCode(HttpStatus.CREATED)
  joinClassroom(
    @Request() req: AuthenticatedRequest,
    @Body() user: CreateClassroomUserDto,
  ) {
    const user_id = req.user.id;
    return this.classService.join(user_id, user);
  }

  @ApiOperation({
    summary: 'Creëer classroomactivity.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':classroom_id/activity')
  @HttpCode(HttpStatus.CREATED)
  createActivity(
    @Request() req: AuthenticatedRequest,
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
    @Body() activity: CreateClassroomActivityDto,
  ) {
    const user_id = req.user.id;
    return this.classService.createActivity(user_id, classroom_id, activity);
  }

  //UPDATEN
  //classroom updaten
  @ApiOperation({
    summary: 'Wijzig een classroom.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Put(':classroom_id')
  async updateClassroomById(
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
    @Body() set: UpdateClassroomDto,
  ) {
    return this.classService.updateById(classroom_id, set);
  }

  //DELETEN
  //classroom verwijderen
  @ApiOperation({
    summary: 'Verwijder een classroom.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Delete(':classroom_id')
  async deleteClassroom(
    @Request() req: AuthenticatedRequest,
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
  ) {
    return this.classService.deleteById(classroom_id, req.user.id);
  }

  //classroom_user verwijderen
  @ApiOperation({
    summary: 'Verwijder een classroomuser.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Delete(':classroom_id/users/:user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveClassroom(
    @Request() req: AuthenticatedRequest,
    @Param('user_id', ParseUserIdPipe) UUID: string,
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
  ) {
    const user_id = req.user.id;
    if (user_id != UUID) {
      throw new BadRequestException('You are not allowed to do this');
    }

    return this.classService.leave(UUID, classroom_id);
  }

  //classroom_set verwijderen
  @ApiOperation({
    summary: 'Verwijder een classroomset.',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Delete(':classroom_id/sets/:set_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSetClassroom(
    @Request() req: AuthenticatedRequest,
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
    @Param('set_id', ParseUUIDPipe) set_id: string,
  ) {
    return this.classService.remove(classroom_id, set_id, req.user.id);
  }
}
