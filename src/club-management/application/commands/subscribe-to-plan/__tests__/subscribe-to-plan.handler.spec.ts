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
import { SubscriptionPlanId } from '../../../../domain/entities/subscription.entity';
import { TestRepositoryFactory } from '../../../../__tests__/factories/repository.factory';
import { TestModuleFactory } from '../../../../__tests__/factories/test-module.factory';
import { ClubBuilder } from '../../../../__tests__/builders/club.builder';
import { SubscriptionBuilder } from '../../../../__tests__/builders/subscription.builder';

describe('SubscribeToPlanHandler', () => {
  let handler: SubscribeToPlanHandler;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;

  beforeEach(async () => {
    // Create mock repositories using factories
    subscriptionRepository =
      TestRepositoryFactory.createMockSubscriptionRepository();
    clubRepository = TestRepositoryFactory.createMockClubRepository();

    // Create test module using factory
    const setup = await TestModuleFactory.createForHandler(
      SubscribeToPlanHandler,
      [
        { provide: SUBSCRIPTION_REPOSITORY, useValue: subscriptionRepository },
        { provide: CLUB_REPOSITORY, useValue: clubRepository },
      ],
    );

    handler = setup.handler;
  });

  describe('execute()', () => {
    it('should subscribe club to STARTER plan successfully', async () => {
      const command = new SubscribeToPlanCommand(
        'club-1',
        SubscriptionPlanId.STARTER,
        'cus_123',
        'sub_123',
      );

      // Use ClubBuilder for club creation
      const mockClub = new ClubBuilder().build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      // Use SubscriptionBuilder for subscription creation
      const mockSubscription = new SubscriptionBuilder()
        .withStarterPlan()
        .build();

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

      const mockClub = new ClubBuilder()
        .withId('club-2')
        .withName('Pro Club')
        .withOwnerId('user-2')
        .build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      // Use SubscriptionBuilder with PRO plan preset
      const mockSubscription = new SubscriptionBuilder()
        .withId('subscription-2')
        .withClubId('club-2')
        .withProPlan()
        .build();

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

      const mockClub = new ClubBuilder()
        .withId('club-3')
        .withName('Beta Club')
        .withOwnerId('user-3')
        .build();

      clubRepository.findById.mockResolvedValue(mockClub);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      // Use SubscriptionBuilder with BETA plan preset
      const mockSubscription = new SubscriptionBuilder()
        .withId('subscription-3')
        .withClubId('club-3')
        .withBetaPlan()
        .build();

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
        SubscriptionPlanId.STARTER,
        'cus_123',
        'sub_123',
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
  });
});
