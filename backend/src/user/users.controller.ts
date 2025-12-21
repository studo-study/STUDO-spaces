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
  Put,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  HeaderResposneDto,
  RegisterUserRequestDto,
  StartPagina,
  UpdateUserDTO,
  UserListResponseDto,
  UserResponseDto,
  UserResponseStatsDto,
} from './users.dto';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../session/session.dto';
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
import { AllsetsResponseDto } from '../studyset/studyset.dto';
import { TotalStats } from '../studysession/studysession.dto';
import {
  ClassroomListResponseDto,
  FullClassroomResponseDto,
} from '../classroom/classroom.dto';
import { Request as ExpressRequest } from 'express';
import { DeleteUserGuard } from '../auth/guards/delete.guard';

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
  ) {
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
  ): Promise<LoginResponseDto> {
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
  async getAllUsers(): Promise<UserListResponseDto> {
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
  ): Promise<UserResponseStatsDto> {
    // Check if user exists first (before authorization)
    const userExists = await this.userService.existsById(user_id);
    if (!userExists) {
      throw new NotFoundException('No user with this id exists');
    }

    // Admin can access any user, regular users only their own
    if (req.user.role !== Role.ADMIN && req.user.id !== user_id) {
      throw new ForbiddenException('You are not allow to see this');
    }

    // Get user data
    return this.userService.getById(user_id);
  }

  // GET USER STUDYSETS --------------------------------------------

  @ApiOperation({ summary: 'Haal alle studysets op van een gebruiker.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Studysets gevonden',
    type: UserResponseStatsDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id/studysets')
  async getAllSetsById(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<AllsetsResponseDto> {
    if (req.user.id !== user_id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allow to see this');
    }
    return this.userService.getAllSetsById(user_id);
  }

  // GET USER STATS -------------------------------------------------

  @ApiOperation({ summary: 'Haal alle statistieken op van een gebruiker.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Statistieken opgehaald',
    type: TotalStats,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id/stats')
  async getAllStats(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<TotalStats> {
    if (req.user.id !== user_id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allow to see this');
    }
    return this.userService.getTotalStats(user_id);
  }

  // GET USER CLASSROOMS -------------------------------------------

  @ApiOperation({ summary: 'Haal alle classrooms op van een gebruiker.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Classrooms opgehaald',
    type: ClassroomListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id/classrooms')
  async getAllUserClassroomsById(
    @Param('user_id', ParseUserIdPipe) userId: string,
  ): Promise<ClassroomListResponseDto> {
    return this.userService.getAllClassroomsByUserId(userId);
  }

  @ApiOperation({ summary: 'Haal specifieke classroom op van een gebruiker.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiParam({ name: 'classroom_id', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Classroom gevonden',
    type: FullClassroomResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':user_id/classrooms/:classroom_id')
  async getClassroomByUserId(
    @Param('user_id', ParseUserIdPipe) userId: string,
    @Param('classroom_id', ParseUUIDPipe) classroom_id: string,
  ): Promise<FullClassroomResponseDto> {
    return this.userService.getClassroomByUserId(userId, classroom_id);
  }

  // START PAGE -----------------------------------------------------

  @ApiOperation({ summary: 'Haal startpagina info op voor een gebruiker.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Startpagina data',
    type: StartPagina,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get(':user_id/start')
  async getStart(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<StartPagina> {
    if (req.user.id !== user_id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allow to see this');
    }
    return this.userService.startPagina(user_id);
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
  @Put(':user_id')
  async updateById(
    @Param('user_id', ParseUserIdPipe) userId: string,
    @Body() body: UpdateUserDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    // Check if user exists first (before authorization)
    const userExists = await this.userService.existsById(userId);
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    // Admin can update any user, regular users only their own profile
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    // Update the user
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
    // Check if user exists first (will throw NotFoundException if not)
    const userExists = await this.userService.existsById(user_id);
    if (!userExists) {
      throw new NotFoundException('No user with this id exists');
    }

    // Admin can delete any user, regular users only their own account
    if (req.user.role !== Role.ADMIN && req.user.id !== user_id) {
      throw new ForbiddenException('Not allowed to delete this user');
    }

    return this.userService.deleteById(user_id);
  }

  // GET HEADERS ----------------------------------------------------

  @ApiOperation({ summary: 'Haal user header info op.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Header informatie opgehaald',
    type: HeaderResposneDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('/:user_id/headers')
  async getHeader(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<HeaderResposneDto> {
    // Check if user exists first
    const userExists = await this.userService.existsById(user_id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Admin can access any user's headers, regular users only their own
    if (req.user.role !== Role.ADMIN && req.user.id !== user_id) {
      throw new NotFoundException('Header not found');
    }

    return this.userService.headerInfo(user_id);
  }

  // GET COURSE ----------------------------------------------------

  @ApiOperation({ summary: 'Haal user vakken op.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Course informatie opgehaald',
    type: HeaderResposneDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('/:user_id/course/:course_id')
  async getCourse(
    @Param('user_id', ParseUserIdPipe) user_id: string,
    @Param('course_id', ParseUserIdPipe) course_id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<AllsetsResponseDto> {
    if (req.user.id !== user_id && req.user.role !== Role.ADMIN) {
      throw new NotFoundException('Course not found');
    }
    return this.userService.getCourse(user_id, course_id);
  }


}