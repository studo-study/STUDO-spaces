import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './users.dto';
import { UpdateUserDTO } from './users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  //CREËEREN VAN USER:
  //create user (api/user)
  @Post()
  createUser(@Body() set: CreateUserDto) {
    return this.UserService.create(set);
  }

  //upload een profielfoto
  @Post(':/id/profile-picture')
  uploadPhoto(@Param('userId') userId: string, @Body('body') body: any) {
    return this.UserService.uploadProfilePicutre(userId, body);
  }

  //OPVRAGEN VAN USER-DATA:
  //alle users opvragen (api/user)
  @Get()
  getAllUsers() {
    return this.UserService.getAll();
  }

  //specifieke user opvragen (api/user/:id)
  @Get(':user_id')
  getUserById(@Param('user_id') id: string) {
    return this.UserService.getById(id);
  }

  //alle studysets van user opvragen (api/user/:id/studyset)
  @Get(':user_id/studyset')
  getAllSetsById(@Param('user_id') user_id: string) {
    return this.UserService.getAllSetsById(user_id);
  }

  //één studyset van user opvragen (api/user/:id/studyset/:set_id)
  @Get(':user_id/studyset/:set_id')
  getSetByIdByUserId(
    @Param('user_id') id: string,
    @Param('set_id') set_id: string,
  ) {
    return this.UserService.getSetById(id, set_id);
  }

  //alle statistieken van user opvragen (api/user/:id/stats)
  @Get('/:user_id/stats')
  getAllStats(@Param('user_id') user_id: string) {
    return this.UserService.getTotalStats(user_id);
  }
  //alle classrooms van user opvragen (api/user/:id/classroom)
  @Get(':user_id/classroom')
  getAllUserClassroomsById(@Param('user_id') id: string) {
    return this.UserService.getAllClassroomsByUserId(id);
  }

  //één classroom van een user opvragen (api/user/:id/classroom/:classroom_id)
  @Get(':user_id/classroom/:classroom_id')
  getClassroomByUserId(
    @Param('user_id') id: string,
    @Param('classroom_id') classroom_id: string,
  ) {
    return this.UserService.getClassroomByUserId(id, classroom_id);
  }

  //UPDATEN:
  //updaten van user (api/user/:id)
  @Put(':user_id')
  updateById(@Param('user_id') id: string, @Body() body: UpdateUserDTO) {
    return this.UserService.updateById(id, body);
  }

  //VERWIJDEREN:
  //specifieke user verwijderen (api/user/:id)
  @Delete(':user_id')
  deleteUserById(@Param('user_id') id: string) {
    return this.UserService.deleteById(id);
  }
}
