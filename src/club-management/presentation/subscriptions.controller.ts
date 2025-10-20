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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import {
  SubscriptionStatusReadModel,
  SubscriptionPlanReadModel,
} from '../application/read-models';
import { SubscriptionPlanId } from '../domain/entities/subscription.entity';
import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

/**
 * Subscriptions Controller - Presentation Layer
 * Handles HTTP requests for subscription management
 */
@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * POST /subscriptions/subscribe
   * Subscribe a club to a plan
   * NOTE: clubId is provided in the DTO as a user may manage multiple clubs
   */
  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Souscrire à un plan d'abonnement",
    description:
      "Permet à un club de souscrire à un plan d'abonnement (Beta, Starter, Pro). Requiert les identifiants Stripe.",
  })
  @ApiResponse({
    status: 201,
    description: 'Abonnement créé avec succès',
    schema: {
      example: {
        success: true,
        data: { subscriptionId: 'sub-uuid-123' },
        message: 'Subscription created successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou club déjà abonné',
  })
  async subscribeToPlan(
    @Body() dto: SubscribeToPlanDto,
    @CurrentUserId() userId: string,
  ) {
    const command = new SubscribeToPlanCommand(
      dto.clubId,
      dto.planId as SubscriptionPlanId,
      userId,
      dto.stripeCustomerId,
      dto.stripeSubscriptionId,
    );

    const subscriptionId: string = await this.commandBus.execute(command);

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
  @ApiOperation({
    summary: "Obtenir l'abonnement d'un club",
    description:
      "Récupère les informations sur l'abonnement actif d'un club (plan, statut, dates, limites).",
  })
  @ApiParam({
    name: 'clubId',
    description: 'ID unique du club',
    example: 'club-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Abonnement récupéré avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Club ou abonnement non trouvé',
  })
  async getSubscription(@Param('clubId') clubId: string) {
    const query = new GetSubscriptionQuery(clubId);
    const subscription: SubscriptionStatusReadModel =
      await this.queryBus.execute(query);

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
  @ApiOperation({
    summary: "Lister les plans d'abonnement",
    description:
      "Récupère la liste de tous les plans d'abonnement disponibles avec leurs caractéristiques (prix, limites, fonctionnalités).",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des plans récupérée avec succès',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'BETA',
            name: 'Beta (Gratuit)',
            price: 0,
            maxTeams: 1,
            features: ['1 équipe', 'Support basique'],
          },
          {
            id: 'STARTER',
            name: 'Starter',
            price: 9.99,
            maxTeams: 3,
            features: ['3 équipes', 'Support prioritaire'],
          },
        ],
      },
    },
  })
  async listPlans() {
    const query = new ListSubscriptionPlansQuery();
    const plans: SubscriptionPlanReadModel[] =
      await this.queryBus.execute(query);

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
  @ApiOperation({
    summary: 'Upgrade un abonnement',
    description:
      "Permet de passer à un plan d'abonnement supérieur (ex: Beta → Starter → Pro).",
  })
  @ApiParam({
    name: 'id',
    description: "ID unique de l'abonnement à upgrader",
    example: 'sub-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Abonnement upgradé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Abonnement non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Upgrade invalide (plan non supérieur ou même plan)',
  })
  async upgradeSubscription(
    @Param('id') subscriptionId: string,
    @Body('newPlanId') newPlanId: string,
  ) {
    const command = new UpgradeSubscriptionCommand(
      subscriptionId,
      newPlanId as SubscriptionPlanId,
    );
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
  @ApiOperation({
    summary: 'Annuler un abonnement',
    description:
      "Permet d'annuler un abonnement actif. L'abonnement reste actif jusqu'à la fin de la période payée.",
  })
  @ApiParam({
    name: 'id',
    description: "ID unique de l'abonnement à annuler",
    example: 'sub-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Abonnement annulé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Abonnement non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Abonnement déjà annulé ou inactif',
  })
  async cancelSubscription(@Param('id') subscriptionId: string) {
    const command = new CancelSubscriptionCommand(subscriptionId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Subscription canceled successfully',
    };
  }
}
