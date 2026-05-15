import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { AuthModule } from '../auth/auth.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, AuthModule, ConfigModule],
  controllers: [SessionController],
  providers: [GoogleStrategy, MicrosoftStrategy],
})
export class SessionModule {}
