import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly UserService: UserService) {}
  //controllers
  @Post()
  createUser(@Body() body: any) {
    return this.UserService.create(body);
  }

  @Get()
  getAllUsers() {
    return this.UserService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.UserService.getById(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.UserService.deleteById(id);
  }

  //users met classroom opvragen
  @Get(':id/classroom')
  getAllUserClassroomsById(@Param('id') id: string) {
    return this.UserService.getAllClassroomsByUserId(id);
  }

  @Get(':id/classroom/:classroom_id')
  getClassroomByUserId(
    @Param('id') id: string,
    @Param('classroom_id') classroom_id: string,
  ) {
    return this.UserService.getClassroomByUserId(id, classroom_id);
  }
}
