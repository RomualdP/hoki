import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserWithoutPassword } from './types/user.type';

interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ) {
    const user = await this.authService.register(
      email,
      password,
      `${firstName} ${lastName}`,
    );
    const { access_token } = await this.authService.login(user);
    return {
      success: true,
      data: {
        user,
        accessToken: access_token,
      },
      message: 'Inscription réussie',
    };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { access_token } = await this.authService.login(user);
    return {
      success: true,
      data: {
        user,
        accessToken: access_token,
      },
      message: 'Connexion réussie',
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(): Promise<void> {
    // Redirect to Google
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(
    @Request() req: RequestWithUser,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return {
      success: true,
      data: req.user,
      message: 'Profil récupéré avec succès',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    // Avec JWT, le logout est côté client (suppression du token)
    // On peut optionnellement blacklister le token ici
    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  }
}
