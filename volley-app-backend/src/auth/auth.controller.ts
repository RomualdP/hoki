import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(
      email,
      password,
      `${firstName} ${lastName}`,
    );
    const { access_token } = await this.authService.login(user);

    // Set httpOnly cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    const { access_token } = await this.authService.login(user);

    // Set httpOnly cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear httpOnly cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

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
  async signupCoach(
    @Body() dto: SignupCoachDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signupCoach(dto);

    // Set httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
  async signupPlayer(
    @Body() dto: SignupWithInvitationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signupPlayer(dto);

    // Set httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
   * Coach signup via invitation
   * POST /auth/signup/assistant
   */
  @Post('signup/assistant')
  async signupCoachViaInvitation(
    @Body() dto: SignupWithInvitationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signupCoachViaInvitation(dto);

    // Set httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
