import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubscribeToPlanDto {
  @IsString()
  @IsNotEmpty()
  planId: string; // 'BETA' | 'STARTER' | 'PRO'

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;
}
