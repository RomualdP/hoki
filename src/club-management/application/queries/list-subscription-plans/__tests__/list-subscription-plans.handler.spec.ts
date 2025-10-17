import { Test, TestingModule } from '@nestjs/testing';
import { ListSubscriptionPlansHandler } from '../list-subscription-plans.handler';
import { SubscriptionPlanId } from '../../../../domain/entities/subscription.entity';

describe('ListSubscriptionPlansHandler', () => {
  let handler: ListSubscriptionPlansHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListSubscriptionPlansHandler],
    }).compile();

    handler = module.get<ListSubscriptionPlansHandler>(
      ListSubscriptionPlansHandler,
    );
  });

  describe('execute()', () => {
    it('should return all subscription plans', async () => {
      const result = await handler.execute();

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: SubscriptionPlanId.BETA,
            name: 'Beta',
            isFree: true,
            hasUnlimitedTeams: true,
          }),
          expect.objectContaining({
            id: SubscriptionPlanId.STARTER,
            name: 'Starter',
            isFree: false,
            hasUnlimitedTeams: false,
          }),
          expect.objectContaining({
            id: SubscriptionPlanId.PRO,
            name: 'Pro',
            isFree: false,
            hasUnlimitedTeams: false,
          }),
        ]),
      );
    });

    it('should return BETA plan with correct details', async () => {
      const result = await handler.execute();

      const betaPlan = result.find(
        (plan) => plan.id === (SubscriptionPlanId.BETA as string),
      );

      expect(betaPlan).toBeDefined();
      expect(betaPlan).toMatchObject({
        id: SubscriptionPlanId.BETA,
        name: 'Beta',
        description: 'Free unlimited plan for early adopters and beta testers',
        price: 0,
        maxTeams: null,
        formattedPrice: 'Free',
        isFree: true,
        hasUnlimitedTeams: true,
        features: expect.arrayContaining([
          'Unlimited teams',
          'All features included',
          'Priority support',
          'Early access to new features',
        ]),
      });
    });

    it('should return STARTER plan with correct details', async () => {
      const result = await handler.execute();

      const starterPlan = result.find(
        (plan) => plan.id === (SubscriptionPlanId.STARTER as string),
      );

      expect(starterPlan).toBeDefined();
      expect(starterPlan).toMatchObject({
        id: SubscriptionPlanId.STARTER,
        name: 'Starter',
        description: 'Perfect for small clubs getting started',
        price: 500,
        maxTeams: 1,
        formattedPrice: '5.00€/month',
        isFree: false,
        hasUnlimitedTeams: false,
        features: expect.arrayContaining([
          '1 team',
          'Match management',
          'Player statistics',
          'Basic support',
        ]),
      });
    });

    it('should return PRO plan with correct details', async () => {
      const result = await handler.execute();

      const proPlan = result.find(
        (plan) => plan.id === (SubscriptionPlanId.PRO as string),
      );

      expect(proPlan).toBeDefined();
      expect(proPlan).toMatchObject({
        id: SubscriptionPlanId.PRO,
        name: 'Pro',
        description: 'For clubs managing multiple teams',
        price: 1500,
        maxTeams: 5,
        formattedPrice: '15.00€/month',
        isFree: false,
        hasUnlimitedTeams: false,
        features: expect.arrayContaining([
          '5 teams',
          'Match management',
          'Advanced statistics',
          'Tournament management',
          'Priority support',
          'Custom reports',
        ]),
      });
    });

    it('should return plans in consistent order', async () => {
      const result1 = await handler.execute();
      const result2 = await handler.execute();

      expect(result1.map((p) => p.id)).toEqual(result2.map((p) => p.id));
      expect(result1[0].id).toBe(SubscriptionPlanId.BETA);
      expect(result1[1].id).toBe(SubscriptionPlanId.STARTER);
      expect(result1[2].id).toBe(SubscriptionPlanId.PRO);
    });

    it('should return read models with all required fields', async () => {
      const result = await handler.execute();

      result.forEach((plan) => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('description');
        expect(plan).toHaveProperty('price');
        expect(plan).toHaveProperty('maxTeams');
        expect(plan).toHaveProperty('features');
        expect(plan).toHaveProperty('formattedPrice');
        expect(plan).toHaveProperty('isFree');
        expect(plan).toHaveProperty('hasUnlimitedTeams');

        expect(typeof plan.id).toBe('string');
        expect(typeof plan.name).toBe('string');
        expect(typeof plan.description).toBe('string');
        expect(typeof plan.price).toBe('number');
        expect(Array.isArray(plan.features)).toBe(true);
        expect(typeof plan.formattedPrice).toBe('string');
        expect(typeof plan.isFree).toBe('boolean');
        expect(typeof plan.hasUnlimitedTeams).toBe('boolean');
      });
    });
  });
});
