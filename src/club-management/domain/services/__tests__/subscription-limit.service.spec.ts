import { SubscriptionLimitService } from '../subscription-limit.service';
import {
  Subscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from '../../entities/subscription.entity';

describe('SubscriptionLimitService', () => {
  let service: SubscriptionLimitService;

  beforeEach(() => {
    service = new SubscriptionLimitService();
  });

  describe('canCreateTeam()', () => {
    it('should return true when subscription allows team creation', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.canCreateTeam(subscription, 0);

      expect(result).toBe(true);
    });

    it('should return false when team limit is reached', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.canCreateTeam(subscription, 1);

      expect(result).toBe(false);
    });

    it('should return true for unlimited plan regardless of team count', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const result = service.canCreateTeam(subscription, 100);

      expect(result).toBe(true);
    });
  });

  describe('getRemainingTeams()', () => {
    it('should return correct remaining teams for STARTER plan', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getRemainingTeams(subscription, 0);

      expect(result).toBe(1);
    });

    it('should return 0 when limit is reached', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getRemainingTeams(subscription, 5);

      expect(result).toBe(0);
    });

    it('should return null for unlimited plan', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const result = service.getRemainingTeams(subscription, 50);

      expect(result).toBeNull();
    });

    it('should handle partial usage correctly', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getRemainingTeams(subscription, 3);

      expect(result).toBe(2);
    });
  });

  describe('validateCanCreateTeams()', () => {
    it('should not throw when teams can be created', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(() =>
        service.validateCanCreateTeams(subscription, 2, 2),
      ).not.toThrow();
    });

    it('should throw when trying to create more teams than remaining', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(() => service.validateCanCreateTeams(subscription, 1, 1)).toThrow(
        'Cannot create 1 teams. Only 0 team(s) remaining in your plan.',
      );
    });

    it('should throw when teamsToCreate is less than 1', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(() => service.validateCanCreateTeams(subscription, 0, 0)).toThrow(
        'Number of teams to create must be at least 1',
      );
    });

    it('should not throw for unlimited plan', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      expect(() =>
        service.validateCanCreateTeams(subscription, 100, 50),
      ).not.toThrow();
    });

    it('should throw with descriptive message showing remaining teams', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(() => service.validateCanCreateTeams(subscription, 3, 3)).toThrow(
        'Cannot create 3 teams. Only 2 team(s) remaining in your plan.',
      );
    });
  });

  describe('validateSubscriptionActive()', () => {
    it('should not throw for active subscription', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(() =>
        service.validateSubscriptionActive(subscription),
      ).not.toThrow();
    });

    it('should throw for inactive subscription', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.INACTIVE,
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

      expect(() => service.validateSubscriptionActive(subscription)).toThrow(
        'Your subscription is not active. Please renew or upgrade your subscription.',
      );
    });

    it('should throw for canceled subscription', () => {
      const subscription = Subscription.reconstitute({
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
        cancelAtPeriodEnd: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => service.validateSubscriptionActive(subscription)).toThrow(
        'Your subscription is not active. Please renew or upgrade your subscription.',
      );
    });
  });

  describe('getUpgradeRecommendation()', () => {
    it('should return null for unlimited plan', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const result = service.getUpgradeRecommendation(subscription, 10);

      expect(result).toBeNull();
    });

    it('should recommend upgrade when at limit', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getUpgradeRecommendation(subscription, 1);

      expect(result).toBe(
        'You have reached your team limit. Upgrade your plan to create more teams.',
      );
    });

    it('should recommend upgrade when 1 team remaining', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getUpgradeRecommendation(subscription, 4);

      expect(result).toBe(
        'You are close to your team limit. Consider upgrading your plan.',
      );
    });

    it('should return null when not close to limit', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.getUpgradeRecommendation(subscription, 2);

      expect(result).toBeNull();
    });
  });

  describe('calculateUsagePercentage()', () => {
    it('should return null for unlimited plan', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const result = service.calculateUsagePercentage(subscription, 50);

      expect(result).toBeNull();
    });

    it('should return 0 for no teams', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.calculateUsagePercentage(subscription, 0);

      expect(result).toBe(0);
    });

    it('should return 100 when at limit', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.calculateUsagePercentage(subscription, 1);

      expect(result).toBe(100);
    });

    it('should calculate correct percentage for partial usage', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.calculateUsagePercentage(subscription, 3);

      expect(result).toBe(60);
    });

    it('should cap at 100 even if over limit', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = service.calculateUsagePercentage(subscription, 5);

      expect(result).toBe(100);
    });

    it('should return 0 for subscription with 0 maxTeams', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.ACTIVE,
        maxTeams: 0,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.calculateUsagePercentage(subscription, 0);

      expect(result).toBe(0);
    });
  });
});
