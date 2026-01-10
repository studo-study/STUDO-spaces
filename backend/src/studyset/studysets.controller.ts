import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  Request,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from './studyset.dto';
import { StudysetService } from './studyset.service';
import { SwitchFolderDto } from '../folder/folder.dto';
import { CreateSetLikeDto, SetLikeResponseDto } from './setlike.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
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
  constructor(private readonly studysetService: StudysetService) {
  }

  //GET alle about-studosets -----------------------------------------------------

  @ApiOperation({ summary: 'Haal alle about-studosets op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle about-studosets opgehaald',
    type: StudysetListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllStudysets(): Promise<StudysetListResponseDto> {
    return this.studysetService.getAll();
  }

  //GET specfieke about-studosets's session ----------------------------------------

  @ApiOperation({ summary: 'Haal alle studysessions op van een studoset.' })
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

  //GET specifieke about-studosets ---------------------------------------------------

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
    @Request() req: AuthenticatedRequest,
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

  @ApiOperation({ summary: 'Start een nieuwe studysession voor deze studoset.' })
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

  // PUT studoset van folder -------------------------------------------------

  @ApiOperation({ summary: 'Verplaats studoset naar andere folder.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiBody({ type: SwitchFolderDto })
  @ApiResponse({
    status: 200,
    description: 'Studyset verplaatst naar andere folder',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Put(':set_id/folder')
  async switchFolder(
    @Param('set_id', ParseStudySetIdPipe) set_id: string,
    @Body() switchbody: SwitchFolderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    if (switchbody.set_id !== set_id) {
      throw new BadRequestException('Set ID mismatch');
    }
    const user_id = req.user.id;
    return this.studysetService.switchFolder(user_id, switchbody);
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
}
