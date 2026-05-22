import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserResponseStatsDto } from '../user/users.dto';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import * as types from '@studo/types';
import {
  AdminStatsResponse,
  AdminUserDetail,
  UserResponse,
} from '@studo/types';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET USER BY CRED -------------------------------------------------

  @ApiOperation({ summary: 'Haal user op via ID.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User gevonden',
    type: UserResponseStatsDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get('cred/:credential')
  async getByCredentials(
    @Param('credential', ParseUserIdPipe) credential: string,
  ): Promise<types.UserResponse[]> {
    return this.adminService.getByCredential(credential);
  }

  // GET PLATFORM STATS -----------------------------------------------

  @ApiOperation({ summary: 'Haal platform statistieken op.' })
  @Roles(Role.ADMIN)
  @Get('stats')
  async getStats(): Promise<AdminStatsResponse> {
    return this.adminService.getStats();
  }

  // GET FULL USER DETAIL BY ID ---------------------------------------

  @ApiOperation({ summary: 'Haal volledige user data op via user ID.' })
  @ApiParam({ name: 'user_id', type: String })
  @Roles(Role.ADMIN)
  @Get('users/:user_id')
  async getUserDetail(
    @Param('user_id') userId: string,
  ): Promise<AdminUserDetail> {
    return this.adminService.getUserDetail(userId);
  }
}
