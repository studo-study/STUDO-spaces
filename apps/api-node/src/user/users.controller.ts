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
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { UserService } from './users.service';
import * as types from '@studo/types';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import {
  RegisterUserRequestDto,
  SyncResponseDto,
  UpdateUserDTO,
  UserListResponseDto,
  UserResponseDto,
  UserResponseStatsDto,
} from './users.dto';
import { LoginResponseDto } from '../session/session.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Assert the requester may act on `userId`: admins may act on anyone,
   * regular users only on themselves. Throws ForbiddenException otherwise.
   */
  private assertSelfOrAdmin(req: AuthenticatedRequest, userId: string): void {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to access this user');
    }
  }

  // REGISTER -------------------------------------------------------

  @ApiOperation({ summary: 'Registreer een nieuwe user.' })
  @ApiResponse({
    status: 201,
    description: 'User succesvol geregistreerd',
    type: LoginResponseDto,
  })
  @ApiBody({ type: RegisterUserRequestDto })
  @Public()
  @Post()
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<types.LoginResponse> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  // GET ALL USERS --------------------------------------------------

  @ApiOperation({ summary: 'Haal alle users op (admin).' })
  @ApiResponse({
    status: 200,
    description: 'Alle users opgehaald',
    type: UserListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(): Promise<types.UserListResponse> {
    return this.userService.getAll();
  }

  // GET USER BY ID -------------------------------------------------

  @ApiOperation({ summary: 'Haal user op via ID.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User gevonden',
    type: UserResponseStatsDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id')
  async getUserById(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.UserResponseStats> {
    // Check if user exists first (before authorization)
    const userExists = await this.userService.existsById(user_id);
    if (!userExists) {
      throw new NotFoundException('No user with this id exists');
    }

    this.assertSelfOrAdmin(req, user_id);

    return this.userService.getById(user_id);
  }

  // SYNC ------------------------------------------------------------

  @ApiOperation({
    summary: 'Haal alle data op die een user nodig heeft bij het laden.',
  })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Sync data opgehaald',
    type: SyncResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get(':user_id/sync')
  async sync(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.SyncResponse> {
    this.assertSelfOrAdmin(req, user_id);
    return this.userService.sync(user_id);
  }

  // UPDATE USER ----------------------------------------------------

  @ApiOperation({ summary: 'Wijzig user gegevens.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'User geüpdatet',
    type: UserResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch(':user_id')
  async updateById(
    @Param('user_id', ParseUserIdPipe) userId: string,
    @Body() body: types.UpdateUser,
    @Request() req: AuthenticatedRequest,
  ): Promise<types.UserResponse> {
    const userExists = await this.userService.existsById(userId);
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }
    this.assertSelfOrAdmin(req, userId);
    return this.userService.updateById(userId, body);
  }

  // DELETE USER ----------------------------------------------------

  @ApiOperation({ summary: 'Verwijder een user.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 204,
    description: 'User verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete('/:user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userExists = await this.userService.existsById(user_id);
    if (!userExists) {
      throw new NotFoundException('No user with this id exists');
    }

    this.assertSelfOrAdmin(req, user_id);

    return this.userService.deleteById(user_id);
  }
}
