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

@ApiTags('track')
@ApiBearerAuth()
@Controller('track')
export class StudoprofileController {
  constructor(private readonly TrackService: StudoprofileService) {}

  @Public()
  @ApiOperation({
    summary: 'Zoek naar sets, users of classrooms zonder ingelogd te zijn.',
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
