import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateStudysessionDto } from './studysession.dto';
import { StudysessionService } from './studysession.service';


@Controller('studysession')
export class StudysessionController {
  constructor(private readonly studysessionService: StudysessionService) {}
  @Get()
  getAllStudysessions() {
    return 'This action returns all study sessions';
  }

  @Get(':id')
  getStudysessionById(@Param('id') id: string) {
    return `This action returns study session #${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  updateStudysession(@Body() studysesh: CreateStudysessionDto) {
    return `This action creates a new classroom #${studysesh.id} with duration ${studysesh.duration}`;
  }

  @Patch(':id')
  updateStudysessionById(@Param('id') id: string) {
    return `This action updates classroom #${id}`;
  }

  @Delete(':id')
  deleteStudysessionById(@Param('id') id: string) {
    return `This action deletes classroom #${id}`;
  }
}
