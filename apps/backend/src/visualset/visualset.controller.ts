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
  ParseUUIDPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { VisualsetService } from './visualset.service';
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
  ApiConsumes,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ScalewayStorageService } from '../scaleway/scaleway-storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  FullVSResponseListDto,
  UpdateVisualsetDto,
  VisualsetResponseDto,
  VisualsetResponseListDto,
} from './visualset.dto';
import * as types from '@studo/types';
import { SetLikeResponseDto } from '../studyset/setlike.dto';
import { SwitchFolderDto } from '../folder/folder.dto';
import * as types_1 from '@studo/types';
import { StudysessionResponseDto } from '../studysession/studysession.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@ApiTags('visualsets')
@ApiBearerAuth()
@Controller('visualsets')
export class VisualsetController {
  constructor(
    private readonly VsService: VisualsetService,
    private readonly storageService: ScalewayStorageService,
  ) {}

  // GET ALL VISUALSETS ---------------------------------------------

  @ApiOperation({ summary: 'Haal alle visualsets op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle visualsets opgehaald',
    type: VisualsetResponseListDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllVisualsets(): Promise<types.VisualsetResponseList> {
    return this.VsService.getAll();
  }

  // GET VISUALSET BY ID --------------------------------------------

  @ApiOperation({ summary: 'Haal een specifieke ((visualset)) op.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Visualset gevonden',
    type: FullVSResponseListDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':set_id')
  async getSetById(
    @Param('set_id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<FullVSResponseListDto> {
    const user_id = req.user.id;
    return this.VsService.getById(user_id, id);
  }

  // GET ALL LIKES --------------------------------------------------

  @ApiOperation({ summary: 'Haal alle likes van een ((visualset)) op.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Visualset gevonden',
    type: FullVSResponseListDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':set_id/likes')
  async getAllSetLikes(
    @Param('set_id', ParseUUIDPipe) set_id: string,
  ): Promise<types.SetLikeResponse[]> {
    return this.VsService.getAllLikes(set_id);
  }

  // CREATE VISUALSET -----------------------------------------------

  @ApiOperation({ summary: 'Maak een nieuwe ((visualset)) aan met images.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subject: { type: 'string' },
        folder_id: { type: 'string' },
        images_metadata: {
          type: 'string',
          description: 'JSON array van image metadata',
        },
        pins_data: {
          type: 'string',
          description: 'JSON array van pins',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Visualset succesvol aangemaakt',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createVisualset(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: types.CreateVisualsetWithFiles,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.VisualsetResponse> {
    const userId = req.user.id;

    const imagesMetadata: types.ImageMetadata[] = JSON.parse(
      body.images_metadata,
    );
    const pinsData: Omit<types.CreatePin, 'img_url'>[] = JSON.parse(
      body.pins_data,
    );

    const uploadedUrls = await this.storageService.uploadMultipleImages(
      files,
      userId,
    );

    const imagesWithUrls: types.CreateImage[] = imagesMetadata.map(
      (meta, index) => ({
        ...meta,
        url: uploadedUrls[index],
      }),
    );

    const pinsWithUrls: types.CreatePin[] = pinsData.map((pin, index) => ({
      ...pin,
      img_url:
        uploadedUrls[Math.floor(index / (pinsData.length / files.length))], // Simplified mapping
    }));

    const createDto: types.CreateVisualset = {
      title: body.title,
      subject: body.subject,
      folder_id: body.folder_id,
      images: imagesWithUrls,
      pins: pinsWithUrls,
    };

    return this.VsService.create(userId, createDto);
  }

  // LIKE VISUALSET -------------------------------------------------

  @ApiOperation({ summary: 'Like een ((visualset)).' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Visualset geliket',
    type: SetLikeResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':set_id/likes')
  @HttpCode(HttpStatus.CREATED)
  async likeStudyset(
    @Body() body: types.CreateSetLike,
    @Request() req: AuthenticatedRequest,
  ): Promise<SetLikeResponseDto> {
    const user_id = req.user.id;
    return this.VsService.likeSet(user_id, body);
  }

  // UPDATE VISUALSET -----------------------------------------------

  @ApiOperation({ summary: 'Wijzig een ((visualset)).' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiBody({ type: UpdateVisualsetDto })
  @ApiResponse({
    status: 200,
    description: 'Visualset geüpdatet',
    type: VisualsetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Put(':set_id')
  async updateStudysetById(
    @Param('set_id', ParseUUIDPipe) id: string,
    @Body() update: UpdateVisualsetDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<types_1.FullVisualsetResponse> {
    const user_id = req.user.id;
    return this.VsService.updateById(user_id, id, update);
  }

  // SWITCH FOLDER --------------------------------------------------

  @ApiOperation({ summary: 'Verplaats een ((visualset)) naar andere folder.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiBody({ type: SwitchFolderDto })
  @ApiResponse({
    status: 200,
    description: 'Visualset verplaatst naar andere folder',
    type: FullVSResponseListDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Put(':set_id/folder')
  async switchFolder(
    @Param('set_id', ParseUUIDPipe) set_id: string,
    @Body() switchbody: SwitchFolderDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<FullVSResponseListDto> {
    const user_id = req.user.id;
    return this.VsService.switchFolder(user_id, switchbody);
  }

  // DELETE VISUALSET -----------------------------------------------

  @ApiOperation({ summary: 'Verwijder een ((visualset)).' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Visualset verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':set_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudysetById(
    @Param('set_id', ParseUUIDPipe) set_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    const user_id = req.user.id;
    return this.VsService.deleteById(user_id, set_id);
  }

  // DELETE LIKE ----------------------------------------------------

  @ApiOperation({ summary: 'Verwijder een setlike.' })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'setlike verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':set_id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSetLike(
    @Request() req: AuthenticatedRequest,
    @Param('set_id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const user_id = req.user.id;
    return this.VsService.removeLike(user_id, id);
  }

  // CREATE STUDYSESSION --------------------------------------------

  @ApiOperation({
    summary: 'Start een nieuwe studysession voor deze ((visualset)).',
  })
  @ApiParam({ name: 'set_id', type: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Studysession aangemaakt',
    type: StudysessionResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post(':set_id/studysession')
  @HttpCode(HttpStatus.CREATED)
  async createSession(
    @Param('set_id', ParseUUIDPipe) set_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<types_1.StudysessionResponse> {
    const user_id = req.user.id;
    return this.VsService.createSession(user_id, set_id);
  }
}
