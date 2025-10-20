import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { SubscriptionPlanId } from '../../club-management/domain/entities/subscription.entity';

export class SignupCoachDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  clubName: string;

  @IsString()
  @IsOptional()
  clubDescription?: string;

  @IsString()
  @IsOptional()
  clubLogo?: string;

  @IsString()
  @IsOptional()
  clubLocation?: string;

  @IsEnum(SubscriptionPlanId)
  @IsNotEmpty()
  planId: SubscriptionPlanId;
}
