import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetSubscriptionHandler } from '../get-subscription.handler';
import { GetSubscriptionQuery } from '../get-subscription.query';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../../domain/repositories/subscription.repository';
import {
  Subscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from '../../../../domain/entities/subscription.entity';

describe('GetSubscriptionHandler', () => {
  let handler: GetSubscriptionHandler;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(async () => {
    const mockSubscriptionRepository: jest.Mocked<ISubscriptionRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByClubId: jest.fn(),
      findByStripeSubscriptionId: jest.fn(),
      findByStripeCustomerId: jest.fn(),
      findByPlanId: jest.fn(),
      findAllActive: jest.fn(),
      findExpiringSubscriptions: jest.fn(),
      findCanceledButActive: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByPlanId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSubscriptionHandler,
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    handler = module.get<GetSubscriptionHandler>(GetSubscriptionHandler);
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return subscription status for STARTER plan', async () => {
      const query = new GetSubscriptionQuery('club-1');

      const mockSubscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      subscriptionRepository.findByClubId.mockResolvedValue(mockSubscription);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        planName: 'Starter',
        status: expect.any(String),
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: expect.any(Date),
        currentPeriodEnd: expect.any(Date),
        cancelAtPeriodEnd: false,
        isActive: true,
        isCanceled: false,
        remainingDays: expect.any(Number),
        formattedPrice: '5,00 €',
        hasUnlimitedTeams: false,
      });
      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-1',
      );
    });

    it('should return subscription status for PRO plan', async () => {
      const query = new GetSubscriptionQuery('club-2');

      const mockSubscription = Subscription.create({
        id: 'sub-2',
        clubId: 'club-2',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_456',
        stripeSubscriptionId: 'sub_456',
      });

      subscriptionRepository.findByClubId.mockResolvedValue(mockSubscription);

      const result = await handler.execute(query);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'sub-2',
          clubId: 'club-2',
          planId: SubscriptionPlanId.PRO,
          planName: 'Pro',
          maxTeams: 5,
          price: 1500,
          formattedPrice: '15,00 €',
          hasUnlimitedTeams: false,
        }),
      );
    });

    it('should return subscription status for BETA plan with unlimited teams', async () => {
      const query = new GetSubscriptionQuery('club-3');

      const mockSubscription = Subscription.create({
        id: 'sub-3',
        clubId: 'club-3',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      subscriptionRepository.findByClubId.mockResolvedValue(mockSubscription);

      const result = await handler.execute(query);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'sub-3',
          clubId: 'club-3',
          planId: SubscriptionPlanId.BETA,
          planName: 'Beta',
          maxTeams: null,
          price: 0,
          formattedPrice: 'Gratuit',
          hasUnlimitedTeams: true,
        }),
      );
    });

    it('should return subscription with cancelAtPeriodEnd true', async () => {
      const query = new GetSubscriptionQuery('club-4');

      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 15);

      const mockSubscription = Subscription.reconstitute({
        id: 'sub-4',
        clubId: 'club-4',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.ACTIVE,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_789',
        stripeSubscriptionId: 'sub_789',
        currentPeriodStart: new Date(),
        currentPeriodEnd,
        cancelAtPeriodEnd: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      subscriptionRepository.findByClubId.mockResolvedValue(mockSubscription);

      const result = await handler.execute(query);

      expect(result.cancelAtPeriodEnd).toBe(true);
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundException when subscription does not exist', async () => {
      const query = new GetSubscriptionQuery('club-nonexistent');

      subscriptionRepository.findByClubId.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Subscription not found',
      );

      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-nonexistent',
      );
    });

    it('should handle repository errors', async () => {
      const query = new GetSubscriptionQuery('club-1');

      subscriptionRepository.findByClubId.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-1',
      );
    });

    it('should return correct date types in read model', async () => {
      const query = new GetSubscriptionQuery('club-5');

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-02-01');

      const mockSubscription = Subscription.reconstitute({
        id: 'sub-5',
        clubId: 'club-5',
        planId: SubscriptionPlanId.PRO,
        status: SubscriptionStatus.ACTIVE,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_999',
        stripeSubscriptionId: 'sub_999',
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      subscriptionRepository.findByClubId.mockResolvedValue(mockSubscription);

      const result = await handler.execute(query);

      expect(result.currentPeriodStart).toEqual(startDate);
      expect(result.currentPeriodEnd).toEqual(endDate);
      expect(result.currentPeriodStart).toBeInstanceOf(Date);
      expect(result.currentPeriodEnd).toBeInstanceOf(Date);
    });
  });
});
