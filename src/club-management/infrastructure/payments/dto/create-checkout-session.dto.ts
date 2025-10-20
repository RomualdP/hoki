import { IsString, IsUrl } from 'class-validator';

/**
 * DTO pour créer une session Stripe Checkout
 */
export class CreateCheckoutSessionDto {
  @IsString()
  priceId: string;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}
