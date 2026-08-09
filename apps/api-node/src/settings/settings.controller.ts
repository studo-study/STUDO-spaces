import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import * as types from '@studo/types';
import { SettingsService } from './settings.service';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Haal de settings van de huidige user op.' })
  @ApiResponse({ status: 200, description: 'Settings gevonden' })
  @Roles(Role.USER)
  @Get()
  async getUserSettings(
    @Request() req: AuthenticatedRequest,
  ): Promise<types.SettingsResponse> {
    // Settings zijn altijd "self": userId komt uit de JWT (AuthGuard), niet uit de URL.
    return this.settingsService.getUserSettings(req.user.id);
  }

  @ApiOperation({ summary: 'Update de settings van de huidige user.' })
  @ApiResponse({ status: 200, description: 'Settings geüpdatet' })
  @Roles(Role.USER)
  @Patch()
  async updateUserSettings(
    @Request() req: AuthenticatedRequest,
    @Body() body: types.UpdateSettings,
  ): Promise<types.SettingsResponse> {
    return this.settingsService.updateUserSettings(req.user.id, body);
  }
}

export default SettingsController;
