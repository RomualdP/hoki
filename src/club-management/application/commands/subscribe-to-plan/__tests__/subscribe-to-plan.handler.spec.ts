import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscribeToPlanHandler } from '../subscribe-to-plan.handler';
import { SubscribeToPlanCommand } from '../subscribe-to-plan.command';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../../domain/repositories/subscription.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { SubscriptionPlanId } from '../../../../domain/entities/subscription.entity';
import { TestRepositoryFactory } from '../../../../__tests__/factories/repository.factory';
import { TestModuleFactory } from '../../../../__tests__/factories/test-module.factory';
import { ClubBuilder } from '../../../../__tests__/builders/club.builder';
import { SubscriptionBuilder } from '../../../../__tests__/builders/subscription.builder';
import { StripeService } from '../../../../infrastructure/payments/stripe.service';
import Stripe from 'stripe';

/**
 * Helper to create a mock Stripe Checkout Session
 */
function createMockStripeSession(
  sessionId: string,
  url: string,
): Stripe.Checkout.Session {
  return {
    id: sessionId,
    url,
    object: 'checkout.session',
    created: Date.now(),
    livemode: false,
    status: 'open',
    mode: 'subscription',
  } as Stripe.Checkout.Session;
}

describe('SubscribeToPlanHandler', () => {
  let handler: SubscribeToPlanHandler;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;
  let stripeService: jest.Mocked<StripeService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Create mock repositories using factories
    subscriptionRepository =
      TestRepositoryFactory.createMockSubscriptionRepository();
    clubRepository = TestRepositoryFactory.createMockClubRepository();

    // Create mock services
    stripeService = {
      createCheckoutSession: jest.fn(),
      isBetaModeEnabled: jest.fn().mockReturnValue(false),
    } as any;

    configService = {
      get: jest.fn(),
    } as any;

    // Create test module using factory
    const setup = await TestModuleFactory.createForHandler(
      SubscribeToPlanHandler,
      [
        { provide: SUBSCRIPTION_REPOSITORY, useValue: subscriptionRepository },
        { provide: CLUB_REPOSITORY, useValue: clubRepository },
        { provide: StripeService, useValue: stripeService },
        { provide: ConfigService, useValue: configService },
      ],
    );

    handler = setup.handler;
  });

  describe('execute()', () => {
    it('should subscribe club to BETA plan successfully', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        SubscriptionPlanId.BETA,
        'user-1',
      );

      // Use ClubBuilder for club creation
      const mockClub = new ClubBuilder().build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      // Use SubscriptionBuilder for subscription creation
      const mockSubscription = new SubscriptionBuilder().withBetaPlan().build();

      subscriptionRepository.save.mockResolvedValue(mockSubscription);

      const result = await handler.execute(command);

      expect(result).toEqual({
        subscriptionId: 'subscription-1',
      });
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-1',
      );
      expect(subscriptionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clubId: 'club-1',
          planId: SubscriptionPlanId.BETA,
        }),
      );
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const command = new SubscribeToPlanCommand(
        'non-existent-club',
        SubscriptionPlanId.STARTER,
        'user-1',
      );

      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Club with ID non-existent-club not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent-club');
      expect(subscriptionRepository.findByClubId).not.toHaveBeenCalled();
      expect(subscriptionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when club already has a subscription', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        SubscriptionPlanId.STARTER,
        'user-1',
      );

      const mockClub = new ClubBuilder().build();

      const existingSubscription = new SubscriptionBuilder()
        .withId('existing-sub')
        .withStarterPlan()
        .build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(
        existingSubscription,
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Club already has an active subscription',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-1',
      );
      expect(subscriptionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid plan ID', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        'INVALID_PLAN' as SubscriptionPlanId,
        'user-1',
      );

      const mockClub = new ClubBuilder().build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        'Plan with ID INVALID_PLAN not found',
      );

      expect(subscriptionRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository save errors', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        SubscriptionPlanId.BETA,
        'user-1',
      );

      const mockClub = new ClubBuilder().build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);
      subscriptionRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findById).toHaveBeenCalled();
      expect(subscriptionRepository.findByClubId).toHaveBeenCalled();
      expect(subscriptionRepository.save).toHaveBeenCalled();
    });

    describe('Stripe Integration', () => {
      it('should create Stripe checkout session for STARTER plan', async () => {
        const command = new SubscribeToPlanCommand(
          'club-1',
          SubscriptionPlanId.STARTER,
          'user-1',
        );

        const mockClub = new ClubBuilder().build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        // Mock config service
        configService.get.mockImplementation((key: string) => {
          if (key === 'STRIPE_PRICE_ID_STARTER') return 'price_starter_123';
          if (key === 'FRONTEND_URL') return 'http://localhost:3001';
          return undefined;
        });

        // Mock Stripe checkout session
        stripeService.createCheckoutSession.mockResolvedValue(
          createMockStripeSession(
            'cs_test_123',
            'https://checkout.stripe.com/pay/cs_test_123',
          ),
        );

        const mockSubscription = new SubscriptionBuilder()
          .withStarterPlan()
          .build();
        subscriptionRepository.save.mockResolvedValue(mockSubscription);

        const result = await handler.execute(command);

        expect(result).toEqual({
          subscriptionId: 'subscription-1',
          checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123',
        });

        expect(stripeService.createCheckoutSession).toHaveBeenCalledWith({
          priceId: 'price_starter_123',
          clubId: 'club-1',
          userId: 'user-1',
          successUrl:
            'http://localhost:3001/signup/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: 'http://localhost:3001/signup/cancel',
        });

        expect(subscriptionRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'PENDING',
          }),
        );
      });

      it('should create Stripe checkout session for PRO plan', async () => {
        const command = new SubscribeToPlanCommand(
          'club-2',
          SubscriptionPlanId.PRO,
          'user-2',
        );

        const mockClub = new ClubBuilder().withId('club-2').build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        configService.get.mockImplementation((key: string) => {
          if (key === 'STRIPE_PRICE_ID_PRO') return 'price_pro_456';
          if (key === 'FRONTEND_URL') return 'http://localhost:3001';
          return undefined;
        });

        stripeService.createCheckoutSession.mockResolvedValue(
          createMockStripeSession(
            'cs_test_456',
            'https://checkout.stripe.com/pay/cs_test_456',
          ),
        );

        const mockSubscription = new SubscriptionBuilder()
          .withId('subscription-2')
          .withProPlan()
          .build();
        subscriptionRepository.save.mockResolvedValue(mockSubscription);

        const result = await handler.execute(command);

        expect(result.checkoutUrl).toBe(
          'https://checkout.stripe.com/pay/cs_test_456',
        );
        expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
          expect.objectContaining({
            priceId: 'price_pro_456',
          }),
        );
      });

      it('should throw error when Stripe price ID is missing', async () => {
        const command = new SubscribeToPlanCommand(
          'club-1',
          SubscriptionPlanId.STARTER,
          'user-1',
        );

        const mockClub = new ClubBuilder().build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        // Config returns undefined for price ID
        configService.get.mockReturnValue(undefined);

        await expect(handler.execute(command)).rejects.toThrow(
          'Missing Stripe price ID: STRIPE_PRICE_ID_STARTER',
        );

        expect(stripeService.createCheckoutSession).not.toHaveBeenCalled();
        expect(subscriptionRepository.save).not.toHaveBeenCalled();
      });

      it('should handle Stripe checkout session creation errors', async () => {
        const command = new SubscribeToPlanCommand(
          'club-1',
          SubscriptionPlanId.STARTER,
          'user-1',
        );

        const mockClub = new ClubBuilder().build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        configService.get.mockImplementation((key: string) => {
          if (key === 'STRIPE_PRICE_ID_STARTER') return 'price_starter_123';
          if (key === 'FRONTEND_URL') return 'http://localhost:3001';
          return undefined;
        });

        // Stripe service throws error
        stripeService.createCheckoutSession.mockRejectedValue(
          new Error('Stripe API unavailable'),
        );

        await expect(handler.execute(command)).rejects.toThrow(
          'Stripe API unavailable',
        );

        expect(stripeService.createCheckoutSession).toHaveBeenCalled();
        expect(subscriptionRepository.save).not.toHaveBeenCalled();
      });

      it('should use default frontend URL when not configured', async () => {
        const command = new SubscribeToPlanCommand(
          'club-1',
          SubscriptionPlanId.STARTER,
          'user-1',
        );

        const mockClub = new ClubBuilder().build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        configService.get.mockImplementation((key: string) => {
          if (key === 'STRIPE_PRICE_ID_STARTER') return 'price_starter_123';
          if (key === 'FRONTEND_URL') return undefined; // Not configured
          return undefined;
        });

        stripeService.createCheckoutSession.mockResolvedValue(
          createMockStripeSession(
            'cs_test_123',
            'https://checkout.stripe.com/pay/cs_test_123',
          ),
        );

        const mockSubscription = new SubscriptionBuilder()
          .withStarterPlan()
          .build();
        subscriptionRepository.save.mockResolvedValue(mockSubscription);

        await handler.execute(command);

        expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
          expect.objectContaining({
            successUrl:
              'http://localhost:3001/signup/success?session_id={CHECKOUT_SESSION_ID}',
            cancelUrl: 'http://localhost:3001/signup/cancel',
          }),
        );
      });

      it('should save subscription with PENDING status for Stripe plans', async () => {
        const command = new SubscribeToPlanCommand(
          'club-1',
          SubscriptionPlanId.STARTER,
          'user-1',
        );

        const mockClub = new ClubBuilder().build();
        clubRepository.findById.mockResolvedValue(mockClub);
        subscriptionRepository.findByClubId.mockResolvedValue(null);

        configService.get.mockImplementation((key: string) => {
          if (key === 'STRIPE_PRICE_ID_STARTER') return 'price_starter_123';
          if (key === 'FRONTEND_URL') return 'http://localhost:3001';
          return undefined;
        });

        stripeService.createCheckoutSession.mockResolvedValue(
          createMockStripeSession(
            'cs_test_123',
            'https://checkout.stripe.com/pay/cs_test_123',
          ),
        );

        const mockSubscription = new SubscriptionBuilder()
          .withStarterPlan()
          .build();
        subscriptionRepository.save.mockResolvedValue(mockSubscription);

        await handler.execute(command);

        expect(subscriptionRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'PENDING',
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          }),
        );
      });
    });
  });
});
