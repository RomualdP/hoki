import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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
import { Club } from '../../../../domain/entities/club.entity';
import {
  Subscription,
  SubscriptionPlanId,
} from '../../../../domain/entities/subscription.entity';

describe('SubscribeToPlanHandler', () => {
  let handler: SubscribeToPlanHandler;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;

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

    const mockClubRepository: jest.Mocked<IClubRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findAll: jest.fn(),
      existsByName: jest.fn(),
      getAllClubNames: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribeToPlanHandler,
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<SubscribeToPlanHandler>(SubscribeToPlanHandler);
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should subscribe club to STARTER plan successfully', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        SubscriptionPlanId.STARTER,
        'cus_123',
        'sub_123',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      const mockSubscription = Subscription.create({
        id: 'subscription-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      subscriptionRepository.save.mockResolvedValue(mockSubscription);

      const result = await handler.execute(command);

      expect(result).toBe('subscription-1');
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(subscriptionRepository.findByClubId).toHaveBeenCalledWith(
        'club-1',
      );
      expect(subscriptionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clubId: 'club-1',
          planId: SubscriptionPlanId.STARTER,
          maxTeams: 1,
          price: 500,
          stripeCustomerId: 'cus_123',
          stripeSubscriptionId: 'sub_123',
        }),
      );
    });

    it('should subscribe club to PRO plan successfully', async () => {
      const command = new SubscribeToPlanCommand(
        'club-2',
        SubscriptionPlanId.PRO,
        'cus_456',
        'sub_456',
      );

      const mockClub = Club.create({
        id: 'club-2',
        name: 'Pro Club',
        ownerId: 'user-2',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      const mockSubscription = Subscription.create({
        id: 'subscription-2',
        clubId: 'club-2',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_456',
        stripeSubscriptionId: 'sub_456',
      });

      subscriptionRepository.save.mockResolvedValue(mockSubscription);

      const result = await handler.execute(command);

      expect(result).toBe('subscription-2');
      expect(subscriptionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          planId: SubscriptionPlanId.PRO,
          maxTeams: 5,
          price: 1500,
        }),
      );
    });

    it('should subscribe club to BETA plan without Stripe info', async () => {
      const command = new SubscribeToPlanCommand(
        'club-3',
        SubscriptionPlanId.BETA,
      );

      const mockClub = Club.create({
        id: 'club-3',
        name: 'Beta Club',
        ownerId: 'user-3',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      const mockSubscription = Subscription.create({
        id: 'subscription-3',
        clubId: 'club-3',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      subscriptionRepository.save.mockResolvedValue(mockSubscription);

      const result = await handler.execute(command);

      expect(result).toBe('subscription-3');
      expect(subscriptionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          planId: SubscriptionPlanId.BETA,
          maxTeams: null,
          price: 0,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        }),
      );
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const command = new SubscribeToPlanCommand(
        'non-existent-club',
        SubscriptionPlanId.STARTER,
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
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const existingSubscription = Subscription.create({
        id: 'existing-sub',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

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
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

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
        SubscriptionPlanId.STARTER,
        'cus_123',
        'sub_123',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

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
  });
});
