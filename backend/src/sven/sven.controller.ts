import { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudysetService } from '../studyset/studyset.service';
import { SvenService } from './sven.service';
import {
  CreateStudysetDto,
  StudysetResponseDto,
} from '../studyset/studyset.dto';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ImageImportResponseDTO } from './sven.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
    // wat je JWT ook bevat
  };
}

@ApiTags('sven')
@ApiBearerAuth()
@Controller('sven')
export class SvenController {
  constructor(private readonly svenService: SvenService) {}

  // POST import from image -------------------------------------------------
  @ApiOperation({ summary: 'Importeer.' })
  @ApiBody({ type: CreateStudysetDto })
  @ApiResponse({
    status: 201,
    description: 'Studyset succesvol aangemaakt',
    type: StudysetResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('/import_studoset')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('file', 3, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webpipe|pdf)$/)) {
          return cb(new Error('This file is not allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  importImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: AuthenticatedRequest,
  ): Promise<ImageImportResponseDTO[]> {
    //const user_id = req.user.id;
    return this.svenService.import(files);
  }
}
