import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ClubRole } from '@prisma/client';

interface RequestWithUser {
  user: {
    id: string;
    clubId: string | null;
    clubRole: ClubRole | null;
  };
}

/**
 * Guard to verify that a coach has an active subscription
 * This guard should be used on routes that require an active subscription
 * (e.g., creating teams, inviting members, etc.)
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, ActiveSubscriptionGuard)
 */
@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
  constructor(private database: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    // Only owners need active subscriptions
    if (user.clubRole !== 'OWNER') {
      return true;
    }

    // Owner must have a club
    if (!user.clubId) {
      throw new ForbiddenException(
        'Owner must be associated with a club to perform this action',
      );
    }

    // Check if club has an active subscription
    const subscription = await this.database.subscription.findUnique({
      where: { clubId: user.clubId },
    });

    if (!subscription) {
      throw new ForbiddenException(
        'Club does not have a subscription. Please subscribe to a plan.',
      );
    }

    if (subscription.status !== 'ACTIVE') {
      throw new ForbiddenException(
        `Club subscription is ${subscription.status.toLowerCase()}. Please update your subscription.`,
      );
    }

    // Check if subscription period is valid
    if (
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date()
    ) {
      throw new ForbiddenException(
        'Club subscription has expired. Please renew your subscription.',
      );
    }

    return true;
  }
}
