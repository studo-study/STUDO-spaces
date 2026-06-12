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
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  MyStudysetsResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from './studyset.dto';
import { StudysetService } from './studyset.service';
import { CreateSetLikeDto, SetLikeResponseDto } from './setlike.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ParseStudySetIdPipe } from '../auth/pipes/parseSetId.pipe';
import { SetCardImageDto, SuggestionImagesResponse } from './image.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
    // wat je JWT ook bevat
  };
}

@ApiTags('studysets')
@ApiBearerAuth()
@Controller('studysets')
export class StudysetsController {
  constructor(private readonly studysetService: StudysetService) {}

  //GET alle studosets -----------------------------------------------------

  @ApiOperation({ summary: 'Haal alle studosets op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle studosets opgehaald',
    type: StudysetListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllStudysets(): Promise<StudysetListResponseDto> {
    return this.studysetService.getAll();
  }

  //GET alle studosets van de ingelogde user -----------------------------------

  @ApiOperation({ summary: 'Haal alle studosets op van de ingelogde user.' })
  @ApiResponse({
    status: 200,
    description: 'Studysets gevonden',
    type: [StudysetResponseDto],
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('me')
  async getMyStudysets(
    @Request() req: AuthenticatedRequest,
  ): Promise<MyStudysetsResponseDto> {
    return this.studysetService.getAllByUser(req.user.id);
  }

  //GET specfieke studosets's session ----------------------------------------

  @ApiOperation({ summary: 'Haal studysession op van een studoset.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Studysessions gevonden',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':set_id/studysession')
  async getStudysessionBySetId(
    @Request() req: AuthenticatedRequest,
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
  ) {
    const user_id = req.user.id;
    return this.studysetService.getBySetId(user_id, set_id);
  }

  // SUGGEST image ---------------------------------------------------------
  @ApiOperation({ summary: 'Suggereer afbeeldingen bij een term (Pexels).' })
  @ApiResponse({ status: 200, type: SuggestionImagesResponse })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('/suggest-image')
  async suggestImage(
    @Query('term') term: string,
    @Query('lang') lang?: string,
  ): Promise<SuggestionImagesResponse> {
    return this.studysetService.suggestImage({ term, lang });
  }

  //GET publieke studoset (geen auth vereist) -----------------------------------

  @ApiOperation({ summary: 'Haal publieke studoset op zonder authenticatie.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Publieke studyset gevonden',
  })
  @Public()
  @Get('public/:set_id')
  async getPublicSetById(@Param('set_id', ParseStudySetIdPipe) set_id: string) {
    return this.studysetService.getPublicById(set_id);
  }

  //GET specifieke studosets ---------------------------------------------------

  @ApiOperation({ summary: 'Haal specifieke studoset op.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Studyset gevonden',
    type: fullSetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':set_id')
  async getSetById(
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<fullSetResponseDto> {
    const user_id = req.user.id;
    return this.studysetService.getById(user_id, set_id);
  }

  //GET alle likes ------------------------------------------------------------

  @ApiOperation({ summary: 'Haal alle likes van een studoset op.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Studyset gevonden',
    type: fullSetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':set_id/likes')
  async getAllSetLikes(
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
  ): Promise<SetLikeResponseDto[]> {
    return this.studysetService.getAllLikes(set_id);
  }

  // POST nieuwe studoset -------------------------------------------------

  @ApiOperation({ summary: 'Maak een nieuwe studoset aan.' })
  @ApiBody({ type: CreateStudysetDto })
  @ApiResponse({
    status: 201,
    description: 'Studyset succesvol aangemaakt',
    type: StudysetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createStudyset(
    @Body() set: CreateStudysetDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<StudysetResponseDto> {
    const user_id = req.user.id;
    return this.studysetService.create(user_id, set);
  }

  // POST Like studoset -----------------------------------------------------

  @ApiOperation({ summary: 'Like een studoset.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiBody({ type: CreateSetLikeDto })
  @ApiResponse({
    status: 201,
    description: 'Studyset geliket',
    type: SetLikeResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':set_id/likes')
  @HttpCode(HttpStatus.CREATED)
  async likeStudyset(
    @Request() req: AuthenticatedRequest,
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
  ): Promise<SetLikeResponseDto> {
    const user_id = req.user.id;
    return this.studysetService.likeSet(user_id, set_id);
  }

  // POST studysessie ----------------------------------------------------------

  @ApiOperation({
    summary: 'Start een nieuwe studysession voor deze studoset.',
  })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Studysession aangemaakt',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':set_id/studysession')
  @HttpCode(HttpStatus.CREATED)
  async createSession(
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const user_id = req.user.id;
    return this.studysetService.createSession(user_id, set_id);
  }

  // PUT studoset -----------------------------------------------------------

  @ApiOperation({ summary: 'Update een studoset.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiBody({ type: UpdateStudysetDto })
  @ApiResponse({
    status: 200,
    description: 'Studyset geüpdatet',
    type: StudysetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Put(':set_id')
  async updateStudysetById(
    @Param('set_id', ParseStudySetIdPipe) id: string,
    @Body() update: UpdateStudysetDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<StudysetResponseDto> {
    const user_id = req.user.id;
    return this.studysetService.updateById(user_id, id, update);
  }

  // DELETE studoset ---------------------------------------------------------

  @ApiOperation({ summary: 'Verwijder een studoset.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Studyset verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':set_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudysetById(
    @Request() req: AuthenticatedRequest,
    @Param('set_id', ParseStudySetIdPipe) id: string,
  ) {
    const user_id = req.user.id;
    return this.studysetService.deleteById(user_id, id);
  }

  // DELETE setlike ---------------------------------------------------------

  @ApiOperation({ summary: 'Verwijder een setlike.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'setlike verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete('/:set_id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSetLike(
    @Request() req: AuthenticatedRequest,
    @Param('set_id', ParseStudySetIdPipe) id: string,
  ) {
    const user_id = req.user.id;
    return this.studysetService.removeLike(user_id, id);
  }
  // SET card image ---------------------------------------------------------
  @ApiOperation({ summary: 'Koppel een suggestion image aan een kaart.' })
  @ApiParam({ name: 'card_id', type: 'string' })
  @ApiBody({ type: SetCardImageDto })
  @ApiResponse({ status: 204, description: 'Afbeelding gekoppeld aan kaart' })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':card_id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setCardImage(
    @Request() req: AuthenticatedRequest,
    @Param('card_id') card_id: string,
    @Body() dto: SetCardImageDto,
  ): Promise<void> {
    return this.studysetService.setCardImage(req.user.id, card_id, dto);
  }
}
