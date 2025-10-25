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
import { CreateStudysetDto, UpdateStudysetDto } from './studyset.dto';
import { StudysetService } from './studyset.service';

@Controller('studyset')
export class StudysetsController {
  constructor(private readonly studysetService: StudysetService) {}
  //studysets opvragen
  @Get()
  getAllStudysets() {
    return this.studysetService.getAll();
  }

  @Get(':id')
  getSetById(@Param('id') id: string) {
    return this.studysetService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createStudyset(@Body() studyset: CreateStudysetDto) {
    return this.studysetService.create(studyset);
  }

  @Patch(':id')
  updateStudysetById(
    @Param('id') id: string,
    //@Body() UpdateStudysetDto: UpdateStudysetDto,
  ):UpdateStudysetDto {
    return this.studysetService.updateById(id);
  }

  @Delete(':id')
  deleteStudysetById(@Param('id') id: string): string {
    return this.studysetService.deleteById(id);
  }
}
