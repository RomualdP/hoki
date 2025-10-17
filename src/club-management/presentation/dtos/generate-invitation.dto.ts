import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class GenerateInvitationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PLAYER', 'ASSISTANT_COACH'])
  type: string;

  @IsNumber()
  @IsOptional()
  expirationDays?: number; // Default: 7 days
}
