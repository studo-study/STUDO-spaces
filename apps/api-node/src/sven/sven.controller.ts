import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
        if (!file.mimetype.match(/\/(jpg|jpeg|heic|png|gif|webpipe|pdf)$/)) {
          return cb(new Error('This file is not allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  importImage(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ImageImportResponseDTO[]> {
    return this.svenService.import(files);
  }
}
