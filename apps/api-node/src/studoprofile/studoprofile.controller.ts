import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { StudoprofileService } from './studoprofile.service';
import { StudoProfileResponseDTO } from './studoprofile.dto';
import { Controller, Get, Param } from '@nestjs/common';

@ApiTags('studoprofiles')
@ApiBearerAuth()
@Controller('studoprofiles')
export class StudoprofileController {
  constructor(private readonly studoprofileService: StudoprofileService) {}

  @Public()
  @ApiOperation({
    summary: 'Haal een studoprofiel op zonder ingelogd te zijn.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Studoprofiel ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Studoprofiel gevonden',
    type: StudoProfileResponseDTO,
  })
  @Get(':id')
  async getStudoprofileById(
    @Param('id') id: string,
  ): Promise<StudoProfileResponseDTO> {
    return await this.studoprofileService.trackSearch(id);
  }
}
