import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';

interface MicrosoftProfile {
  id: string;
  displayName: string;
  name?: { givenName?: string; familyName?: string };
  emails?: { value: string }[];
  upn?: string;
}

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID')!,
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET')!,
      callbackURL:
        configService.get<string>('MICROSOFT_CALLBACK_URL') ||
        'http://localhost:3000/api/sessions/microsoft/callback',
      scope: ['user.read'],
      tenant: 'common', // 'common', 'organizations', 'consumers', of je tenant ID
    });
    console.log('✅ MicrosoftStrategy initialized');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
  ) {
    return {
      email: profile.emails?.[0]?.value || profile.upn || '',
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      picture: '',
      accessToken,
    };
  }
}
