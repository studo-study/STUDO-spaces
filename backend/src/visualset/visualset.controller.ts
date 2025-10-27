import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateStudysetDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from '../studyset/studyset.dto';
import { CreateSetLikeDto, SetLikeResponseDto } from '../studyset/setlike.dto';
import { SwitchFolderDto } from '../folder/folder.dto';
import { VisualsetService } from './visualset.service';

@Controller('visualset')
export class VisualsetController {
  constructor(private readonly VsService: VisualsetService) {}
  //OPVRAGEN VAN VISUALSET-DATA
  //alle studysets opvragen (api/studyset/)
  @Get()
  getAllVisualsets() {
    return this.VsService.getAll();
  }

  //specifieke studyset opvragen (api/visualset/:id)
  @Get(':set_id')
  getSetById(@Param('set_id') id: string) {
    return this.studysetService.getById(id);
  }

  @Get(':set_id/studysession')
  getStudysessionBySetId(@Param('set_id') set_id: string) {
    return this.VsService.getBySetId(set_id);
  }

  //CREËEREN VAN STUDYSET
  //aanmaken van één studyset (api/visualset/
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createStudyset(@Body() set: CreateStudysetDto) {
    return this.VsService.create(set);
  }

  //set liken
  @Post(':set_id/likes')
  @HttpCode(HttpStatus.CREATED)
  likeStudyset(@Body() body: CreateSetLikeDto): SetLikeResponseDto {
    return this.VsService.likeSet(body);
  }

  //UDPATEN
  //updaten van één studyset (api/visualset/:id)
  @Put(':set_id')
  updateStudysetById(
    @Param('set_id') id: string,
    @Body() update: UpdateStudysetDto,
  ): StudysetResponseDto {
    return this.VsService.updateById(id, update);
  }

  @Put(':set_id/folder')
  switchFolder(
    @Param('set_id') id: string,
    @Body() switchbody: SwitchFolderDto,
  ) {
    return this.VsService.switchFolder(switchbody);
  }

  //DELETEN
  //verwijderen van één visualset (api/visualset/:id)
  @Delete(':set_id')
  deleteStudysetById(@Param('set_id') id: string): string {
    return this.VsService.deleteById(id);
  }
}
