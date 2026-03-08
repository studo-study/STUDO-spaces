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
  constructor(private readonly TrackService: StudoprofileService) {}

  @Public()
  @ApiOperation({
    summary: 'Zoek naar studoprofielen zonder ingelogd te zijn.',
  })
  @ApiParam({
    name: 'query',
    type: String,
    description: 'Zoekterm',
  })
  @ApiResponse({
    status: 200,
    description: 'Zoekresultaten gevonden',
    type: StudoProfileResponseDTO,
  })
  @Get(':id')
  async getPublicSearchResults(
    @Param('id') id: string,
  ): Promise<StudoProfileResponseDTO> {
    return await this.TrackService.trackSearch(id);
  }
}
