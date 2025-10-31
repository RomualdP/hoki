import { IsUrl } from 'class-validator';

/**
 * DTO pour créer une session Stripe Customer Portal
 */
export class CreatePortalSessionDto {
  @IsUrl()
  returnUrl: string;
}
