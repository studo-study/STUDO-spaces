import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { PublicSearchRsultsDto } from './search.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

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
    type: PublicSearchRsultsDto,
  })
  @Get('public/:query')
  async getPublicSearchResults(@Param('query') query: string) {
    return await this.searchService.publicSearch(query);
  }
}
