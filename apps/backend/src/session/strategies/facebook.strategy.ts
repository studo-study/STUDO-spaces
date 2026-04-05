import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID')!,
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET')!,
      callbackURL:
        configService.get<string>('FACEBOOK_CALLBACK_URL') ||
        'http://localhost:3000/api/sessions/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'name', 'photos'], // data die je wilt ophalen
      scope: ['email'],
    });
    console.log('✅ FacebookStrategy initialized');
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = {
      email: profile.emails?.[0]?.value || '',
      displayName: profile.displayName,
      picture: profile.photos?.[0]?.value || '',
      accessToken,
    };
    return user;
  }
}

//TODO
//Hier kan ik niks mee doen zolang ik geen btw nummer heb en officieel web adres
