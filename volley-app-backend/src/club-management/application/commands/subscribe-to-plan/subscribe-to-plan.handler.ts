/**
 * SubscribeToPlanHandler - CQRS Command Handler
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  ClubNotFoundException,
  SubscriptionAlreadyActiveException,
} from '../../../domain/exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscribeToPlanCommand } from './subscribe-to-plan.command';
import {
  Subscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from '../../../domain/entities/subscription.entity';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';
import { randomUUID } from 'crypto';
import { StripeService } from '../../../infrastructure/payments/stripe.service';

type SubscribeToPlanResult = {
  subscriptionId: string;
  checkoutUrl?: string;
};

@Injectable()
@CommandHandler(SubscribeToPlanCommand)
export class SubscribeToPlanHandler
  implements ICommandHandler<SubscribeToPlanCommand, SubscribeToPlanResult>
{
  private readonly logger = new Logger(SubscribeToPlanHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: SubscribeToPlanCommand,
  ): Promise<SubscribeToPlanResult> {
    // 1. Verify club exists
    const club = await this.clubRepository.findById(command.clubId);
    if (!club) {
      throw new ClubNotFoundException(command.clubId);
    }

    // 2. Check if club already has a subscription
    const existingSubscription = await this.subscriptionRepository.findByClubId(
      command.clubId,
    );
    if (existingSubscription) {
      throw new SubscriptionAlreadyActiveException();
    }

    // 3. Get plan configuration
    const plan = SubscriptionPlans.getById(command.planId);

    // 4. Handle subscription based on plan type
    if (command.planId === SubscriptionPlanId.BETA) {
      // BETA mode: Create active subscription directly
      return this.createBetaSubscription(command, plan);
    } else {
      // STARTER/PRO: Create Stripe checkout session
      return this.createStripeSubscription(command, plan);
    }
  }

  /**
   * Create BETA subscription (no Stripe, active immediately)
   */
  private async createBetaSubscription(
    command: SubscribeToPlanCommand,

    plan: any,
  ): Promise<SubscribeToPlanResult> {
    this.logger.log(`Creating BETA subscription for club ${command.clubId}`);

    const subscription = Subscription.create({
      id: randomUUID(),
      clubId: command.clubId,
      planId: plan.id,
      maxTeams: plan.maxTeams,
      price: plan.price,
      stripeCustomerId: undefined,
      stripeSubscriptionId: undefined,
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    return {
      subscriptionId: savedSubscription.id,
    };
  }

  /**
   * Create Stripe subscription (redirect to Stripe Checkout)
   */
  private async createStripeSubscription(
    command: SubscribeToPlanCommand,

    plan: any,
  ): Promise<SubscribeToPlanResult> {
    this.logger.log(
      `Creating Stripe subscription for club ${command.clubId}, plan ${plan.id}`,
    );

    // Get Stripe price ID from environment
    const priceIdEnvKey =
      plan.id === SubscriptionPlanId.STARTER
        ? 'STRIPE_PRICE_ID_STARTER'
        : 'STRIPE_PRICE_ID_PRO';

    const priceId = this.configService.get<string>(priceIdEnvKey);

    if (!priceId) {
      throw new Error(`Missing Stripe price ID: ${priceIdEnvKey}`);
    }

    // Create Stripe checkout session
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    const checkoutSession = await this.stripeService.createCheckoutSession({
      priceId,
      clubId: command.clubId,
      userId: command.userId,
      successUrl: `${frontendUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/signup/cancel`,
    });

    // Create subscription in PENDING status (will be activated by webhook)
    const subscription = Subscription.create({
      id: randomUUID(),
      clubId: command.clubId,
      planId: plan.id,
      maxTeams: plan.maxTeams,
      price: plan.price,
      status: SubscriptionStatus.PENDING, // Waiting for Stripe confirmation
      stripeCustomerId: undefined, // Will be set by webhook
      stripeSubscriptionId: undefined, // Will be set by webhook
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    return {
      subscriptionId: savedSubscription.id,
      checkoutUrl: checkoutSession.url || undefined,
    };
  }
}
