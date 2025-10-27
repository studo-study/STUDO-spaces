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

import { StudysessionService } from './studysession.service';
import { UpdateStudysessionDto } from './studysession.dto';

@Controller('studysession')
export class StudysessionController {
  constructor(private readonly seshService: StudysessionService) {}
  //OPVRAGEN VAN SESSION-DATA
  //alle sessies opvragen
  @Get()
  getAllStudysessions() {
    return this.seshService.getAll();
  }

  //specifieke sessie opvragen
  @Get('/:session_id')
  getStudysessionById(@Param('session_id') session_id: string) {
    return this.seshService.getById(session_id);
  }

  //UPDATEN
  //updaten van specifieke sessie
  @Patch(':session_id')
  updateStudysessionById(
    @Param('session_id') session_id: string,
    @Body() update: UpdateStudysessionDto,
  ) {
    return this.seshService.updateById(session_id, update);
  }

  //DELETEN
  //deleten van specifieke sessie
  @Delete(':session_id')
  deleteStudysessionById(@Param('session_id') session_id: string) {
    return this.seshService.deleteById(session_id);
  }
}
