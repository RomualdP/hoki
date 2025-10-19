/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  UnauthorizedException as ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DatabaseService } from '../database/database.service';
import {
  User,
  UserPayload,
  GoogleProfile,
  UserWithoutPassword,
} from './types/user.type';
import { SignupCoachDto, SignupWithInvitationDto } from './dto';
import { CreateClubCommand } from '../club-management/application/commands/create-club/create-club.command';
import { SubscribeToPlanCommand } from '../club-management/application/commands/subscribe-to-plan/subscribe-to-plan.command';
import { ValidateInvitationQuery } from '../club-management/application/queries/validate-invitation/validate-invitation.query';
import { AcceptInvitationCommand } from '../club-management/application/commands/accept-invitation/accept-invitation.command';
import { SubscriptionPlanId } from '../club-management/domain/entities/subscription.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwtService: JwtService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  private excludePassword(user: User): UserWithoutPassword {
    const userCopy = { ...user } as Record<string, unknown>;
    delete userCopy.password;
    return userCopy as UserWithoutPassword;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.database.user.findUnique({ where: { email } });
    if (user?.password && (await bcrypt.compare(password, user.password))) {
      return this.excludePassword(user);
    }
    return null;
  }

  async login(user: UserWithoutPassword): Promise<{ access_token: string }> {
    const payload: UserPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      clubId: user.clubId,
      clubRole: user.clubRole,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateGoogleUser(profile: GoogleProfile): Promise<User> {
    const { email, name, picture } = profile;

    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return this.database.user.update({
        where: { email },
        data: {
          firstName: name?.split(' ')[0] || '',
          lastName: name?.split(' ').slice(1).join(' ') || '',
          avatar: picture,
          lastLoginAt: new Date(),
        },
      });
    }

    const user = await this.database.user.create({
      data: {
        email,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        avatar: picture,
        lastLoginAt: new Date(),
      },
    });

    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    await this.database.userAttribute.createMany({
      data: [
        {
          userId: user.id,
          attribute: 'FITNESS',
          value: 1.0,
        },
        {
          userId: user.id,
          attribute: 'LEADERSHIP',
          value: 1.0,
        },
      ],
    });

    return user;
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string = '',
  ): Promise<UserWithoutPassword> {
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.database.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    await this.database.userAttribute.createMany({
      data: [
        {
          userId: user.id,
          attribute: 'FITNESS',
          value: 1.0,
        },
        {
          userId: user.id,
          attribute: 'LEADERSHIP',
          value: 1.0,
        },
      ],
    });

    return this.excludePassword(user);
  }

  /**
   * Coach signup: Create user + club + subscription
   * If planId is BETA, subscription is created directly
   * Otherwise, returns Stripe checkout URL
   */
  async signupCoach(dto: SignupCoachDto): Promise<{
    user: UserWithoutPassword;
    access_token: string;
    clubId: string;
    checkoutUrl?: string;
  }> {
    // 1. Check if email already exists
    const existingUser = await this.database.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Create user
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    let user = await this.database.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'USER',
      },
    });

    // Create user profile and attributes
    await this.database.userProfile.create({
      data: { userId: user.id },
    });

    await this.database.userAttribute.createMany({
      data: [
        { userId: user.id, attribute: 'FITNESS', value: 1.0 },
        { userId: user.id, attribute: 'LEADERSHIP', value: 1.0 },
      ],
    });

    // 3. Create club
    const createClubResult = await this.commandBus.execute(
      new CreateClubCommand(
        dto.clubName,
        dto.clubDescription || null,
        dto.clubLogo || null,
        dto.clubLocation || null,
        user.id,
      ),
    );

    const clubId = createClubResult.clubId;

    // 4. Handle subscription based on plan
    let checkoutUrl: string | undefined;

    if (dto.planId === SubscriptionPlanId.BETA) {
      // BETA plan: create subscription directly
      await this.commandBus.execute(
        new SubscribeToPlanCommand(clubId, dto.planId, user.id),
      );
    } else {
      // STARTER or PRO: create Stripe checkout session
      const subscribeResult = await this.commandBus.execute(
        new SubscribeToPlanCommand(clubId, dto.planId, user.id),
      );
      checkoutUrl = subscribeResult.checkoutUrl;
    }

    // 5. Update user with club info
    user = await this.database.user.update({
      where: { id: user.id },
      data: {
        clubId,
        clubRole: 'COACH',
      },
    });

    // 6. Generate JWT
    const { access_token } = await this.login(this.excludePassword(user));

    return {
      user: this.excludePassword(user),
      access_token,
      clubId,
      checkoutUrl,
    };
  }

  /**
   * Player signup via invitation
   */
  async signupPlayer(dto: SignupWithInvitationDto): Promise<{
    user: UserWithoutPassword;
    access_token: string;
    clubId: string;
    hadPreviousClub: boolean;
  }> {
    return this.signupWithInvitation(dto, 'PLAYER');
  }

  /**
   * Assistant coach signup via invitation
   */
  async signupAssistant(dto: SignupWithInvitationDto): Promise<{
    user: UserWithoutPassword;
    access_token: string;
    clubId: string;
    hadPreviousClub: boolean;
  }> {
    return this.signupWithInvitation(dto, 'ASSISTANT_COACH');
  }

  /**
   * Common logic for player/assistant signup
   */
  private async signupWithInvitation(
    dto: SignupWithInvitationDto,
    expectedType: 'PLAYER' | 'ASSISTANT_COACH',
  ): Promise<{
    user: UserWithoutPassword;
    access_token: string;
    clubId: string;
    hadPreviousClub: boolean;
  }> {
    // 1. Validate invitation
    const invitationResult = await this.queryBus.execute(
      new ValidateInvitationQuery(dto.invitationToken),
    );

    if (!invitationResult.isValid) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    if (invitationResult.invitation.type !== expectedType) {
      throw new BadRequestException(
        `This invitation is for ${invitationResult.invitation.type}, not ${expectedType}`,
      );
    }

    // 2. Check if user exists
    const existingUser = await this.database.user.findUnique({
      where: { email: dto.email },
    });

    const hadPreviousClub = !!(existingUser && existingUser.clubId);

    let user: User;

    if (existingUser) {
      // User exists - will change clubs
      user = existingUser;
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = await this.database.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'USER',
        },
      });

      await this.database.userProfile.create({
        data: { userId: user.id },
      });

      await this.database.userAttribute.createMany({
        data: [
          { userId: user.id, attribute: 'FITNESS', value: 1.0 },
          { userId: user.id, attribute: 'LEADERSHIP', value: 1.0 },
        ],
      });
    }

    // 3. Accept invitation (this will update user's clubId and clubRole)
    await this.commandBus.execute(
      new AcceptInvitationCommand(dto.invitationToken, user.id),
    );

    // 4. Reload user to get updated clubId and clubRole
    const updatedUser = await this.database.user.findUnique({
      where: { id: user.id },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after invitation acceptance');
    }

    // 5. Generate JWT
    const { access_token } = await this.login(
      this.excludePassword(updatedUser),
    );

    return {
      user: this.excludePassword(updatedUser),
      access_token,
      clubId: updatedUser.clubId!,
      hadPreviousClub,
    };
  }
}
