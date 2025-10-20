import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { StripeService } from './stripe.service';

/**
 * Module Payments pour gérer Stripe
 */
@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
