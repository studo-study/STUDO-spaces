import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudysessionService } from '../studysession/studysession.service';
import { SearchService } from './search.service';
import { PublicSearchRsultsDto, SearchResultsDto } from './search.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
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
  constructor(private readonly SearchService: SearchService) {}

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
    return await this.SearchService.publicSearch(query);
  }

  @ApiOperation({
    summary: 'Zoek naar sets, users of classrooms.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID waarvoor gezocht wordt',
  })
  @ApiParam({
    name: 'query',
    type: String,
    description: 'Zoekterm',
  })
  @ApiResponse({
    status: 200,
    description: 'Zoekresultaten gevonden',
    type: SearchResultsDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get(':id/:query')
  async getSearchResults(
    @Param('query') query: string,
    @Param('id') user_id: string,
  ) {
    return await this.SearchService.search(user_id, query);
  }
}
