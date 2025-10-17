import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubscribeToPlanDto } from './dtos';
import {
  SubscribeToPlanCommand,
  UpgradeSubscriptionCommand,
  CancelSubscriptionCommand,
} from '../application/commands';
import {
  GetSubscriptionQuery,
  ListSubscriptionPlansQuery,
} from '../application/queries';

/**
 * Subscriptions Controller - Presentation Layer
 * Handles HTTP requests for subscription management
 */
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * POST /subscriptions/subscribe
   * Subscribe a club to a plan
   */
  @Post('subscribe')
  async subscribeToPlan(@Body() dto: SubscribeToPlanDto) {
    // TODO: Extract clubId from JWT token or request context
    const clubId = 'club-id-from-context'; // Placeholder

    const command = new SubscribeToPlanCommand(
      clubId,
      dto.planId,
      dto.stripeCustomerId,
      dto.stripeSubscriptionId,
    );

    const subscriptionId = await this.commandBus.execute(command);

    return {
      success: true,
      data: { subscriptionId },
      message: 'Subscription created successfully',
    };
  }

  /**
   * GET /subscriptions/club/:clubId
   * Get subscription status for a club
   */
  @Get('club/:clubId')
  async getSubscription(@Param('clubId') clubId: string) {
    const query = new GetSubscriptionQuery(clubId);
    const subscription = await this.queryBus.execute(query);

    return {
      success: true,
      data: subscription,
    };
  }

  /**
   * GET /subscriptions/plans
   * List all available subscription plans
   */
  @Get('plans')
  async listPlans() {
    const query = new ListSubscriptionPlansQuery();
    const plans = await this.queryBus.execute(query);

    return {
      success: true,
      data: plans,
    };
  }

  /**
   * PUT /subscriptions/:id/upgrade
   * Upgrade subscription to a new plan
   */
  @Put(':id/upgrade')
  async upgradeSubscription(
    @Param('id') subscriptionId: string,
    @Body('newPlanId') newPlanId: string,
  ) {
    const command = new UpgradeSubscriptionCommand(subscriptionId, newPlanId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Subscription upgraded successfully',
    };
  }

  /**
   * PUT /subscriptions/:id/cancel
   * Cancel subscription
   */
  @Put(':id/cancel')
  async cancelSubscription(@Param('id') subscriptionId: string) {
    const command = new CancelSubscriptionCommand(subscriptionId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Subscription canceled successfully',
    };
  }
}
