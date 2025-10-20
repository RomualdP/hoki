import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe.service';

describe('StripeService', () => {
  let service: StripeService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as any;
  });

  describe('Beta Mode', () => {
    it('should initialize in BETA mode when BETA_MODE_ENABLED is true', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'true';
        return undefined;
      });

      service = new StripeService(configService);

      expect(service.isBetaModeEnabled()).toBe(true);
    });

    it('should throw error when creating checkout session in BETA mode', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'true';
        return undefined;
      });

      service = new StripeService(configService);

      await expect(
        service.createCheckoutSession({
          priceId: 'price_123',
          clubId: 'club-1',
          userId: 'user-1',
          successUrl: 'http://localhost:3001/success',
          cancelUrl: 'http://localhost:3001/cancel',
        }),
      ).rejects.toThrow('Stripe checkout is disabled in BETA mode');
    });

    it('should throw error when creating portal session in BETA mode', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'true';
        return undefined;
      });

      service = new StripeService(configService);

      await expect(
        service.createPortalSession({
          customerId: 'cus_123',
          returnUrl: 'http://localhost:3001/dashboard',
        }),
      ).rejects.toThrow('Stripe portal is disabled in BETA mode');
    });

    it('should throw error when constructing webhook event in BETA mode', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'true';
        return undefined;
      });

      service = new StripeService(configService);

      expect(() => {
        service.constructWebhookEvent('payload', 'signature');
      }).toThrow('Stripe webhooks are disabled in BETA mode');
    });
  });

  describe('Configuration', () => {
    it('should throw error when STRIPE_SECRET_KEY is missing and BETA mode is disabled', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'false';
        if (key === 'STRIPE_SECRET_KEY') return undefined;
        return undefined;
      });

      expect(() => {
        new StripeService(configService);
      }).toThrow(
        'STRIPE_SECRET_KEY is required when BETA_MODE_ENABLED is false',
      );
    });

    it('should initialize successfully with valid STRIPE_SECRET_KEY', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'false';
        if (key === 'STRIPE_SECRET_KEY') return 'sk_test_123';
        return undefined;
      });

      expect(() => {
        new StripeService(configService);
      }).not.toThrow();
    });
  });

  describe('Webhook Signature Verification', () => {
    it('should throw error when STRIPE_WEBHOOK_SECRET is not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'BETA_MODE_ENABLED') return 'false';
        if (key === 'STRIPE_SECRET_KEY') return 'sk_test_123';
        if (key === 'STRIPE_WEBHOOK_SECRET') return undefined;
        return undefined;
      });

      service = new StripeService(configService);

      expect(() => {
        service.constructWebhookEvent('payload', 'signature');
      }).toThrow('STRIPE_WEBHOOK_SECRET is not configured');
    });
  });
});
