import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubscribeToPlanDto {
  @ApiProperty({
    description: "ID du club qui souscrit à l'abonnement",
    example: 'club-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  clubId: string;

  @ApiProperty({
    description: "ID du plan d'abonnement (BETA, STARTER, PRO)",
    example: 'STARTER',
    enum: ['BETA', 'STARTER', 'PRO'],
  })
  @IsString()
  @IsNotEmpty()
  planId: string; // 'BETA' | 'STARTER' | 'PRO'

  @ApiPropertyOptional({
    description: 'ID client Stripe (fourni par le frontend après paiement)',
    example: 'cus_stripe123',
  })
  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @ApiPropertyOptional({
    description: 'ID abonnement Stripe (fourni par le frontend après paiement)',
    example: 'sub_stripe123',
  })
  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;
}
