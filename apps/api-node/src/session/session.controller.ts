import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import {
  ImpersonateDto,
  LoginRequestDto,
  LoginResponseDto,
} from './session.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthDelayInterceptor } from '../auth/interceptors/authDelay.interceptors';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Build the frontend auth-callback redirect URL for a signed token.
  private buildCallbackRedirect(res: Response, token: string) {
    const frontendUrl =
      this.configService.get<string>('url.url') || 'http://localhost:4000';
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  // inloggen met STUDO --------------------------------------------------
  @ApiOperation({ summary: 'De user inloggen.' })
  @ApiResponse({
    status: 200,
    description: 'User geregistreerd',
    type: LoginResponseDto,
  })
  @UseInterceptors(AuthDelayInterceptor)
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);
    return { token };
  }

  // impersoneren (admin) -------------------------------------------------
  @ApiOperation({ summary: 'Impersonate een user (enkel admin).' })
  @ApiResponse({
    status: 200,
    description: 'Kortlevende impersonatie-token',
    type: LoginResponseDto,
  })
  @Roles(Role.ADMIN)
  @Post('impersonate')
  @HttpCode(HttpStatus.OK)
  async impersonate(
    @CurrentUser() admin: { id: string },
    @Body() body: ImpersonateDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.impersonate(body, admin.id);
    return { token };
  }

  // inloggen met GOOGLE --------------------------------------------
  @ApiOperation({
    summary: 'De user inloggen met Google.',
  })
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect naar Google login
  }

  @ApiOperation({
    summary: 'De user redirecten van Google.',
  })
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = await this.authService.validateGoogleUser(req.user as any);
    return this.buildCallbackRedirect(res, token);
  }

  // inloggen met MICROSOFT --------------------------------------------
  @ApiOperation({
    summary: 'De user inloggen met Microsoft authenticator.',
  })
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {
    // redirect naar Microsoft login
  }

  @ApiOperation({
    summary: 'De user redirecten van Microsoft authenticator.',
  })
  @Public()
  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = await this.authService.validateMicrosoftUser(req.user as any);
    return this.buildCallbackRedirect(res, token);
  }

  // inloggen met FACEBOOK ---------------------------------------------
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // redirect naar Facebook login
  }

  @ApiOperation({
    summary: 'De user redirecten van Facebook.',
  })
  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req: Request) {
    return req.user;
  }

  // inloggen met Smartschool ---------------------------------------------
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Get('smartschool')
  @UseGuards(AuthGuard('smartschool'))
  async smartschoolLogin() {
    // redirect naar Smartschool login
  }

  @ApiOperation({
    summary: 'De user redirecten van smartschool.',
  })
  @Public()
  @Get('smartschool/callback')
  @UseGuards(AuthGuard('smartschool'))
  async smartschoolLoginCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.validateSmartschoolUser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.user as any,
    );
    return this.buildCallbackRedirect(res, token);
  }

  // social login (na OAuth op de client) ---------------------------------
  @Public()
  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  async socialLogin(
    @Body()
    body: {
      email: string;
      displayName: string;
      provider: string;
      providerId?: string;
      imgUrl?: string;
    },
  ) {
    return this.authService.validateSocialUser(body);
  }
}
