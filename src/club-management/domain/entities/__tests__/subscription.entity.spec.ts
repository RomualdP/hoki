import {
  Subscription,
  SubscriptionStatus,
  SubscriptionPlanId,
} from '../subscription.entity';
import { SubscriptionPlans } from '../../value-objects/subscription-plan.vo';

describe('Subscription Entity', () => {
  describe('canCreateTeam()', () => {
    it('should return true when subscription is ACTIVE and team limit not reached', () => {
      const subscription = Subscription.create({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = subscription.canCreateTeam(0);

      expect(result).toBe(true);
    });

    it('should return false when subscription is INACTIVE', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.INACTIVE,
        price: 500,
        maxTeams: 1,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = subscription.canCreateTeam(0);

      expect(result).toBe(false);
    });

    it('should return false when subscription is CANCELED', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.CANCELED,
        price: 500,
        maxTeams: 1,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = subscription.canCreateTeam(0);

      expect(result).toBe(false);
    });

    it('should return false when team limit is reached', () => {
      const subscription = Subscription.create({
        id: 'sub-2',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = subscription.canCreateTeam(1); // STARTER maxTeams = 1

      expect(result).toBe(false);
    });

    it('should return true when plan has unlimited teams (BETA)', () => {
      const subscription = Subscription.create({
        id: 'sub-3',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const result = subscription.canCreateTeam(100); // Any number

      expect(result).toBe(true);
    });

    it('should return true when PRO plan and under limit', () => {
      const subscription = Subscription.create({
        id: 'sub-4',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = subscription.canCreateTeam(4); // PRO maxTeams = 5

      expect(result).toBe(true);
    });

    it('should return false when PRO plan and limit reached', () => {
      const subscription = Subscription.create({
        id: 'sub-5',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const result = subscription.canCreateTeam(5); // PRO maxTeams = 5

      expect(result).toBe(false);
    });

    it('should return false when subscription is PAYMENT_FAILED', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.PAYMENT_FAILED,
        price: 500,
        maxTeams: 1,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = subscription.canCreateTeam(0);

      expect(result).toBe(false);
    });
  });

  describe('upgrade()', () => {
    it('should successfully upgrade from STARTER to PRO', () => {
      const subscription = Subscription.create({
        id: 'sub-6',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const proPlan = SubscriptionPlans.getById(SubscriptionPlanId.PRO);
      // Convert to SubscriptionPlanConfig
      const proPlanConfig = {
        id: proPlan.id,
        name: proPlan.name,
        price: proPlan.price,
        maxTeams: proPlan.maxTeams,
        stripePriceId: proPlan.stripePriceId || undefined,
      };

      expect(() => subscription.upgrade(proPlanConfig)).not.toThrow();
      expect(subscription.planId).toBe(SubscriptionPlanId.PRO);
      expect(subscription.maxTeams).toBe(5);
      expect(subscription.price).toBe(1500);
    });

    it('should throw error when trying to upgrade from BETA plan', () => {
      const subscription = Subscription.create({
        id: 'sub-7',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      const starterPlan = SubscriptionPlans.getById(SubscriptionPlanId.STARTER);
      // Convert to SubscriptionPlanConfig
      const starterPlanConfig = {
        id: starterPlan.id,
        name: starterPlan.name,
        price: starterPlan.price,
        maxTeams: starterPlan.maxTeams,
        stripePriceId: starterPlan.stripePriceId || undefined,
      };

      expect(() => subscription.upgrade(starterPlanConfig)).toThrow(
        'Cannot upgrade from BETA plan',
      );
    });

    it('should throw error when trying to downgrade (PRO to STARTER)', () => {
      const subscription = Subscription.create({
        id: 'sub-8',
        clubId: 'club-1',
        planId: SubscriptionPlanId.PRO,
        maxTeams: 5,
        price: 1500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const starterPlan = SubscriptionPlans.getById(SubscriptionPlanId.STARTER);
      // Convert to SubscriptionPlanConfig
      const starterPlanConfig = {
        id: starterPlan.id,
        name: starterPlan.name,
        price: starterPlan.price,
        maxTeams: starterPlan.maxTeams,
        stripePriceId: starterPlan.stripePriceId || undefined,
      };

      expect(() => subscription.upgrade(starterPlanConfig)).toThrow(
        'Can only upgrade to a higher plan',
      );
    });

    it('should throw error when upgrading to same plan', () => {
      const subscription = Subscription.create({
        id: 'sub-9',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      const starterPlan = SubscriptionPlans.getById(SubscriptionPlanId.STARTER);
      // Convert to SubscriptionPlanConfig
      const starterPlanConfig = {
        id: starterPlan.id,
        name: starterPlan.name,
        price: starterPlan.price,
        maxTeams: starterPlan.maxTeams,
        stripePriceId: starterPlan.stripePriceId || undefined,
      };

      expect(() => subscription.upgrade(starterPlanConfig)).toThrow(
        'Already subscribed to this plan',
      );
    });
  });

  describe('cancel()', () => {
    it('should set cancelAtPeriodEnd to true when canceling paid subscription', () => {
      const subscription = Subscription.create({
        id: 'sub-10',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        maxTeams: 1,
        price: 500,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });

      expect(subscription.cancelAtPeriodEnd).toBe(false);

      subscription.cancel();

      expect(subscription.cancelAtPeriodEnd).toBe(true);
    });

    it('should throw error when trying to cancel already CANCELED subscription', () => {
      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.CANCELED,
        price: 500,
        maxTeams: 1,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => subscription.cancel()).toThrow(
        'Subscription is already canceled',
      );
    });

    it('should cancel BETA subscription immediately', () => {
      const subscription = Subscription.create({
        id: 'sub-11',
        clubId: 'club-1',
        planId: SubscriptionPlanId.BETA,
        maxTeams: null,
        price: 0,
      });

      subscription.cancel();

      expect(subscription.status).toBe(SubscriptionStatus.CANCELED);
    });

    it('should maintain current period dates when canceling', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-02-01');

      const subscription = Subscription.reconstitute({
        id: 'sub-1',
        clubId: 'club-1',
        planId: SubscriptionPlanId.STARTER,
        status: SubscriptionStatus.ACTIVE,
        price: 500,
        maxTeams: 1,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      subscription.cancel();

      expect(subscription.currentPeriodStart).toEqual(startDate);
      expect(subscription.currentPeriodEnd).toEqual(endDate);
    });
  });
});
