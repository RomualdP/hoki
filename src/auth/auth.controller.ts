import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserWithoutPassword } from './types/user.type';
import { SignupCoachDto, SignupWithInvitationDto } from './dto';

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
      throw new UnauthorizedException('Identifiants invalides');
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

  /**
   * Coach signup: Create user + club + subscription
   * POST /auth/signup/coach
   */
  @Post('signup/coach')
  async signupCoach(@Body() dto: SignupCoachDto) {
    const result = await this.authService.signupCoach(dto);
    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.access_token,
        clubId: result.clubId,
        checkoutUrl: result.checkoutUrl,
      },
      message: result.checkoutUrl
        ? 'Inscription réussie. Veuillez compléter le paiement.'
        : 'Inscription réussie. Bienvenue dans votre club !',
    };
  }

  /**
   * Player signup via invitation
   * POST /auth/signup/player
   */
  @Post('signup/player')
  async signupPlayer(@Body() dto: SignupWithInvitationDto) {
    const result = await this.authService.signupPlayer(dto);
    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.access_token,
        clubId: result.clubId,
      },
      message: result.hadPreviousClub
        ? 'Inscription réussie. Vous avez changé de club.'
        : 'Inscription réussie. Bienvenue dans votre club !',
      warning: result.hadPreviousClub
        ? 'Vous avez quitté votre ancien club pour rejoindre ce nouveau club.'
        : undefined,
    };
  }

  /**
   * Assistant coach signup via invitation
   * POST /auth/signup/assistant
   */
  @Post('signup/assistant')
  async signupAssistant(@Body() dto: SignupWithInvitationDto) {
    const result = await this.authService.signupAssistant(dto);
    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.access_token,
        clubId: result.clubId,
      },
      message: result.hadPreviousClub
        ? 'Inscription réussie. Vous avez changé de club.'
        : 'Inscription réussie. Bienvenue dans votre club !',
      warning: result.hadPreviousClub
        ? 'Vous avez quitté votre ancien club pour rejoindre ce nouveau club.'
        : undefined,
    };
  }
}
