import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { StudysessionService } from './studysession.service';
import {
  UpdateStudysessionDto,
  StudysessionResponseDto,
  StudysessionListResponseDto,
} from './studysession.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
    // wat je JWT ook bevat
  };
}

@ApiTags('studysessions')
@ApiBearerAuth()
@Controller('studysessions')
export class StudysessionController {
  constructor(private readonly seshService: StudysessionService) {}

  // GET ALL STUDYSESSIONS ------------------------------------------
  @ApiOperation({ summary: 'Haal alle studysessions op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle studysessions opgehaald',
    type: StudysessionListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllStudysessions(): Promise<StudysessionListResponseDto> {
    return this.seshService.getAll();
  }

  // GET STUDYSESSION BY ID -----------------------------------------
  @ApiOperation({ summary: 'Haal specifieke studysession op.' })
  @ApiParam({ name: 'session_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Studysession gevonden',
    type: StudysessionResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get('/:session_id')
  async getStudysessionById(
    @Request() req: AuthenticatedRequest,
    @Param('session_id', ParseUUIDPipe) session_id: string,
  ): Promise<StudysessionResponseDto> {
    const user_id = req.user.id;
    return this.seshService.getById(user_id, session_id);
  }

  // UPDATE STUDYSESSION --------------------------------------------
  @ApiOperation({ summary: 'Wijzig een studysession.' })
  @ApiParam({ name: 'session_id', type: 'uuid' })
  @ApiBody({ type: UpdateStudysessionDto })
  @ApiResponse({
    status: 204,
    description: 'Studysession geüpdatet',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Put(':session_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStudysessionById(
    @Request() req: AuthenticatedRequest,
    @Param('session_id', ParseUUIDPipe) session_id: string,
    @Body() update: UpdateStudysessionDto,
  ): Promise<void> {
    const user_id = req.user.id;
    return this.seshService.updateById(user_id, session_id, update);
  }

  // RESET STUDYSESSION --------------------------------------------
  @ApiOperation({ summary: 'Wijzig een studysession.' })
  @ApiParam({ name: 'session_id', type: 'uuid' })
  @ApiBody({ type: UpdateStudysessionDto })
  @ApiResponse({
    status: 200,
    description: 'Studysession geüpdatet',
    type: StudysessionResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Put(':session_id/reset')
  async resetStudysessionById(
    @Request() req: AuthenticatedRequest,
    @Param('session_id', ParseUUIDPipe) session_id: string,
  ): Promise<StudysessionResponseDto> {
    const user_id = req.user.id;
    return this.seshService.resetById(user_id, session_id);
  }

  // DELETE STUDYSESSION --------------------------------------------

  @ApiOperation({ summary: 'Verwijder een studysession.' })
  @ApiParam({ name: 'session_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Studysession verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Delete(':session_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudysessionById(
    @Request() req: AuthenticatedRequest,
    @Param('session_id', ParseUUIDPipe) session_id: string,
  ): Promise<void> {
    const user_id = req.user.id;
    return this.seshService.deleteById(user_id, session_id);
  }
}
