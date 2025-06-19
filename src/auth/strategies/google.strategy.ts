import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  Profile,
  StrategyOptions,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const options: StrategyOptions = {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    };
    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;
    const user = await this.authService.validateGoogleUser({
      email: emails?.[0]?.value ?? '',
      name:
        name?.givenName && name?.familyName
          ? `${name.givenName} ${name.familyName}`
          : (name?.givenName ?? ''),
      picture: photos?.[0]?.value ?? '',
    });
    done(null, user);
  }
}
