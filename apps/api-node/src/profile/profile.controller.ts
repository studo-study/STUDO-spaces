import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseDto } from './profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

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

  // PUBLIC GET PROFILE BY ID ----------------------------------------------
  @Public()
  @ApiOperation({ summary: 'Haal specifiek profiel op.' })
  @ApiParam({ name: 'profile_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Profiel gevonden',
    type: ProfileResponseDto,
  })
  //@UseGuards(CheckUserAccessGuard)
  @Get('/public/:profile_id')
  async getPublicProfileById(
    @Param('profile_id', ParseUUIDPipe) profile_id: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getPublicById(profile_id);
  }
}
