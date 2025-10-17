import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpgradeSubscriptionHandler } from '../upgrade-subscription.handler';
import { UpgradeSubscriptionCommand } from '../upgrade-subscription.command';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../../domain/repositories/subscription.repository';
import {
  Subscription,
  SubscriptionPlanId,
} from '../../../../domain/entities/subscription.entity';

describe('UpgradeSubscriptionHandler', () => {
  let handler: UpgradeSubscriptionHandler;
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
        UpgradeSubscriptionHandler,
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    handler = module.get<UpgradeSubscriptionHandler>(
      UpgradeSubscriptionHandler,
    );
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
  });

  describe('execute()', () => {
    it('should upgrade subscription from STARTER to PRO successfully', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-1',
        SubscriptionPlanId.PRO,
      );

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
          planId: SubscriptionPlanId.PRO,
          maxTeams: 5,
          price: 1500,
        }),
      );
    });

    it('should throw NotFoundException when subscription does not exist', async () => {
      const command = new UpgradeSubscriptionCommand(
        'non-existent',
        SubscriptionPlanId.PRO,
      );

      subscriptionRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Subscription not found',
      );

      expect(subscriptionRepository.findById).toHaveBeenCalledWith(
        'non-existent',
      );
      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to upgrade from BETA', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-beta',
        SubscriptionPlanId.STARTER,
      );

      const mockSubscription = Subscription.create({
        id: 'sub-beta',
        clubId: 'club-beta',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);

      await expect(handler.execute(command)).rejects.toThrow(
        'Cannot upgrade from BETA plan',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to downgrade', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-1',
        SubscriptionPlanId.STARTER,
      );

      const mockSubscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      subscriptionRepository.findById.mockResolvedValue(mockSubscription);

      await expect(handler.execute(command)).rejects.toThrow(
        'Can only upgrade to a higher plan',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to upgrade to same plan', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-1',
        SubscriptionPlanId.STARTER,
      );

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

      await expect(handler.execute(command)).rejects.toThrow(
        'Already subscribed to this plan',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to upgrade to BETA', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-1',
        SubscriptionPlanId.BETA,
      );

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

      await expect(handler.execute(command)).rejects.toThrow(
        'Cannot downgrade to BETA plan',
      );

      expect(subscriptionRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = new UpgradeSubscriptionCommand(
        'sub-1',
        SubscriptionPlanId.PRO,
      );

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

      expect(subscriptionRepository.findById).toHaveBeenCalledWith('sub-1');
      expect(subscriptionRepository.update).toHaveBeenCalled();
    });
  });
});
