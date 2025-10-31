import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CancelSubscriptionHandler } from '../cancel-subscription.handler';
import { CancelSubscriptionCommand } from '../cancel-subscription.command';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../../domain/repositories/subscription.repository';
import {
  Subscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from '../../../../domain/entities/subscription.entity';

describe('CancelSubscriptionHandler', () => {
  let handler: CancelSubscriptionHandler;
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
        CancelSubscriptionHandler,
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    handler = module.get<CancelSubscriptionHandler>(CancelSubscriptionHandler);
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
  });

  describe('execute()', () => {
    it('should cancel paid subscription successfully (remains active until period end)', async () => {
      const command = new CancelSubscriptionCommand('sub-1');

      const mockSubscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);
      subscriptionRepository.update.mockResolvedValue(mockSubscription);

      await handler.execute(command);

      expect(subscriptionRepository.findById).toHaveBeenCalledWith('sub-1');
      expect(subscriptionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'sub-1',
          status: SubscriptionStatus.ACTIVE,
          cancelAtPeriodEnd: true,
        }),
      );
    });

    it('should cancel BETA subscription immediately', async () => {
      const command = new CancelSubscriptionCommand('sub-beta');

      const mockSubscription = Subscription.create({
        id: 'sub-beta',
        clubId: 'club-beta',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);
      subscriptionRepository.update.mockResolvedValue(mockSubscription);

      await handler.execute(command);

      expect(subscriptionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'sub-beta',
          status: SubscriptionStatus.CANCELED,
        }),
      );
    });

    it('should throw NotFoundException when subscription does not exist', async () => {
      const command = new CancelSubscriptionCommand('non-existent');

      subscriptionRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Subscription not found',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when subscription is already canceled', async () => {
      const command = new CancelSubscriptionCommand('sub-1');

      const mockSubscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.CANCELED,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);

      await expect(handler.execute(command)).rejects.toThrow(
        'Subscription is already canceled',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = new CancelSubscriptionCommand('sub-1');

      const mockSubscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);
      subscriptionRepository.update.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
