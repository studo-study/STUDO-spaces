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
  Request,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  FolderResponseDto,
  FolderListResponseDto,
  FullFolderResponseDto,
  CreateFolderDto,
} from './folder.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
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

@ApiTags('folders')
@ApiBearerAuth()
@Controller('folders')
export class FolderController {
  constructor(private readonly foldersService: FolderService) {}

  // GET ALL FOLDERS ------------------------------------------------
  @ApiOperation({ summary: 'Haal alle folders op (admin).' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Alle folders opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllFolder(): Promise<FolderListResponseDto> {
    return this.foldersService.getAll();
  }

  // GET ALL USER FOLDERS
  @ApiOperation({ summary: 'Haal alle folders van een user op.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Alle folders van user opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get('/:user_id')
  async getAllUserFolders(
    @Param('user_id', ParseUserIdPipe) user_id: string,
  ): Promise<FolderListResponseDto> {
    return this.foldersService.getAllUser(user_id);
  }

  // GET FOLDER BY ID -----------------------------------------------

  @ApiOperation({ summary: 'Haal specifieke folder op.' })
  @ApiParam({ name: 'folder_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Folder gevonden',
    type: FullFolderResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get('/:user_id/:folder_id')
  async getFolderById(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Param('folder_id', ParseUUIDPipe) folder_id: string,
  ): Promise<FullFolderResponseDto> {
    console.log('✅ Endpoint reached! folder_id:', folder_id);
    return this.foldersService.getById(folder_id);
  }

  // DELETE FOLDER --------------------------------------------------

  @ApiOperation({ summary: 'Verwijder een folder.' })
  @ApiParam({ name: 'folder_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Folder verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Delete('/:folder_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFolder(
    @Param('folder_id', ParseUUIDPipe) folder_id: string,
  ): Promise<void> {
    return this.foldersService.deleteById(folder_id);
  }

  // POST FOLDER --------------------------------------------------

  @ApiOperation({ summary: 'Creëer een folder.' })
  @ApiResponse({
    status: 200,
    description: 'Folder aangemaakt',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createFolder(
    @Request() req: AuthenticatedRequest,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderResponseDto> {
    const user_id = req.user.id;
    return this.foldersService.create(user_id, createFolderDto);
  }
}
