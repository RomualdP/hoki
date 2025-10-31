/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  RawBodyRequest,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { StripeService } from '../infrastructure/payments/stripe.service';
import {
  CreateCheckoutSessionDto,
  CreatePortalSessionDto,
} from '../infrastructure/payments/dto';
import { CommandBus } from '@nestjs/cqrs';
import { GetSubscriptionQuery } from '../application/queries/get-subscription/get-subscription.query';
import { QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';

/**
 * Controller pour gérer les paiements Stripe
 * Routes : /payments/*
 */
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * POST /payments/create-checkout-session
   * Créer une session Stripe Checkout pour souscrire à un plan
   */
  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @CurrentUserId() userId: string,
    @Req() req: Request & { user: { clubId: string } },
  ) {
    if (this.stripeService.isBetaModeEnabled()) {
      return {
        error: 'Stripe checkout is disabled in BETA mode',
        betaMode: true,
      };
    }

    const clubId = req.user.clubId;

    if (!clubId) {
      return {
        error: 'User must be associated with a club',
      };
    }

    const session = await this.stripeService.createCheckoutSession({
      priceId: dto.priceId,
      clubId,
      userId,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * POST /payments/create-portal-session
   * Créer une session Stripe Customer Portal pour gérer l'abonnement
   */
  @Post('create-portal-session')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPortalSession(
    @Body() dto: CreatePortalSessionDto,
    @CurrentUserId() userId: string,
    @Req() req: Request & { user: { clubId: string } },
  ) {
    if (this.stripeService.isBetaModeEnabled()) {
      return {
        error: 'Stripe portal is disabled in BETA mode',
        betaMode: true,
      };
    }

    const clubId = req.user.clubId;

    if (!clubId) {
      return {
        error: 'User must be associated with a club',
      };
    }

    // Récupérer la subscription du club pour obtenir le customerId
    const subscription = await this.queryBus.execute<GetSubscriptionQuery, any>(
      new GetSubscriptionQuery(clubId),
    );

    if (!subscription || !subscription.stripeCustomerId) {
      return {
        error: 'No active subscription found for this club',
      };
    }

    const session = await this.stripeService.createPortalSession({
      customerId: subscription.stripeCustomerId,
      returnUrl: dto.returnUrl,
    });

    return {
      url: session.url,
    };
  }

  /**
   * POST /webhooks/stripe
   * Webhook Stripe pour gérer les événements de paiement
   * IMPORTANT: Ce endpoint doit recevoir le raw body (pas de parsing JSON)
   */
  @Post('/webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (this.stripeService.isBetaModeEnabled()) {
      this.logger.warn('Stripe webhook received but BETA mode is enabled');
      return { received: true, betaMode: true };
    }

    if (!signature) {
      this.logger.error('Missing stripe-signature header');
      return { error: 'Missing stripe-signature header' };
    }

    let event: Stripe.Event;

    try {
      // Vérifier la signature du webhook
      event = this.stripeService.constructWebhookEvent(
        req.rawBody || '',
        signature,
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      return { error: 'Webhook signature verification failed' };
    }

    this.logger.log(`Received Stripe webhook: ${event.type}`);

    // Gérer les différents types d'événements
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(
        `Error handling webhook ${event.type}: ${error.message}`,
        error.stack,
      );
      return { error: 'Webhook processing failed' };
    }

    return { received: true };
  }

  /**
   * Gérer l'événement checkout.session.completed
   * Activé quand un utilisateur finalise son paiement
   */
  private async handleCheckoutSessionCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    this.logger.log(`Checkout session completed: ${session.id}`);
    this.logger.log(`Customer: ${session.customer}`);
    this.logger.log(`Subscription: ${session.subscription}`);

    const clubId = session.metadata?.clubId || session.client_reference_id;

    if (!clubId) {
      this.logger.error('No clubId found in session metadata');
      return;
    }

    // TODO: Implémenter la logique pour activer la subscription dans la DB
    // Utiliser un Command handler (ActivateSubscriptionCommand)
    this.logger.log(`TODO: Activate subscription for club ${clubId}`);
  }

  /**
   * Gérer l'événement customer.subscription.updated
   * Activé quand une subscription est modifiée (upgrade, downgrade, renouvellement)
   */
  private async handleSubscriptionUpdated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    this.logger.log(`Subscription updated: ${subscription.id}`);
    this.logger.log(`Status: ${subscription.status}`);

    // TODO: Implémenter la logique pour mettre à jour la subscription dans la DB
    // Utiliser un Command handler (UpdateSubscriptionCommand)
    this.logger.log(`TODO: Update subscription ${subscription.id}`);
  }

  /**
   * Gérer l'événement customer.subscription.deleted
   * Activé quand une subscription est annulée
   */
  private async handleSubscriptionDeleted(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    this.logger.log(`Subscription deleted: ${subscription.id}`);

    // TODO: Implémenter la logique pour désactiver la subscription dans la DB
    // Utiliser un Command handler (CancelSubscriptionCommand)
    this.logger.log(`TODO: Cancel subscription ${subscription.id}`);
  }

  /**
   * Gérer l'événement invoice.payment_failed
   * Activé quand un paiement échoue
   */
  private async handleInvoicePaymentFailed(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription as
      | string
      | Stripe.Subscription
      | null;

    this.logger.log(`Invoice payment failed: ${invoice.id}`);
    this.logger.log(
      `Subscription: ${typeof subscriptionId === 'string' ? subscriptionId : (subscriptionId?.id ?? 'N/A')}`,
    );

    // TODO: Implémenter la logique pour marquer la subscription comme "payment_failed"
    // Envoyer un email à l'utilisateur
    this.logger.log(`TODO: Handle payment failure for invoice ${invoice.id}`);
  }
}
