/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

/**
 * Service pour gérer les opérations Stripe
 * Responsabilité : Création de sessions checkout, portail client, gestion des webhooks
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly betaModeEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.betaModeEnabled =
      this.configService.get<string>('BETA_MODE_ENABLED') === 'true';

    if (!this.betaModeEnabled && !secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is required when BETA_MODE_ENABLED is false',
      );
    }

    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-09-30.clover',
      });
    }
  }

  /**
   * Créer une session Stripe Checkout pour la souscription
   * @param priceId - ID du prix Stripe (price_xxx)
   * @param clubId - ID du club
   * @param userId - ID de l'utilisateur
   * @param successUrl - URL de redirection après succès
   * @param cancelUrl - URL de redirection après annulation
   * @returns Session Checkout
   */
  async createCheckoutSession(params: {
    priceId: string;
    clubId: string;
    userId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> {
    if (this.betaModeEnabled) {
      throw new Error('Stripe checkout is disabled in BETA mode');
    }

    this.logger.log(
      `Creating checkout session for club ${params.clubId}, user ${params.userId}`,
    );

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        metadata: {
          clubId: params.clubId,
          userId: params.userId,
        },
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        client_reference_id: params.clubId,
      });

      this.logger.log(`Checkout session created: ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to create checkout session: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Créer une session Stripe Customer Portal pour gérer l'abonnement
   * @param customerId - ID du client Stripe
   * @param returnUrl - URL de retour après gestion
   * @returns Session Customer Portal
   */
  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    if (this.betaModeEnabled) {
      throw new Error('Stripe portal is disabled in BETA mode');
    }

    this.logger.log(
      `Creating portal session for customer ${params.customerId}`,
    );

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: params.customerId,
        return_url: params.returnUrl,
      });

      this.logger.log(`Portal session created: ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to create portal session: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Vérifier la signature d'un webhook Stripe
   * @param payload - Corps de la requête (raw)
   * @param signature - Signature Stripe
   * @returns Événement Stripe
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    if (this.betaModeEnabled) {
      throw new Error('Stripe webhooks are disabled in BETA mode');
    }

    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Récupérer une souscription Stripe par ID
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (this.betaModeEnabled) {
      throw new Error('Stripe operations are disabled in BETA mode');
    }

    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Récupérer une session de checkout par ID
   */
  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    if (this.betaModeEnabled) {
      throw new Error('Stripe operations are disabled in BETA mode');
    }

    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  /**
   * Vérifier si le mode BETA est activé
   */
  isBetaModeEnabled(): boolean {
    return this.betaModeEnabled;
  }
}
