import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseDto, ProfileListResponseDto } from './profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  // GET ALL PROFILES -----------------------------------------------

  @ApiOperation({ summary: 'Haal alle profielen op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle profielen opgehaald',
    type: ProfileListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAll(): Promise<ProfileListResponseDto> {
    return this.profileService.getAll();
  }

  // GET PROFILE BY ID ----------------------------------------------

  @ApiOperation({ summary: 'Haal specifiek profiel op.' })
  @ApiParam({ name: 'profile_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Profiel gevonden',
    type: ProfileResponseDto,
  })
  //@UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get(':profile_id')
  async getProfileById(
    @Param('profile_id', ParseUUIDPipe) profile_id: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getById(profile_id);
  }
}
