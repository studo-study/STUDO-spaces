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
  Res, // 👈 Voeg toe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 👈 Voeg toe
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto, LoginResponseDto } from './session.dto';
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

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService, // 👈 Inject ConfigService
  ) {}

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
    console.log('🔍 Google callback - User:', req.user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = await this.authService.validateGoogleUser(req.user as any);

    const frontendUrl =
      this.configService.get<string>('url.url') || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token}`;

    console.log('🔍 Full redirect URL:', redirectUrl);

    return res.redirect(redirectUrl);
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

    // 👇 Gebruik configService en correct pad
    const frontendUrl =
      this.configService.get<string>('url.url') || 'http://localhost:5173/home';

    // 👇 Redirect naar frontend met token in URL
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
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
    // redirect naar Facebook login
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
    const frontendUrl =
      this.configService.get<string>('url.url') || 'http://localhost:5173/home';
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  //inloggen met microsoft --------------------------------------------------
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
      img_url?: string;
    },
  ) {
    return this.authService.validateSocialUser(body);
  }
}
