import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateInvitationDto {
  @ApiProperty({
    description: "ID du club pour lequel générer l'invitation",
    example: 'club-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  clubId: string;

  @ApiProperty({
    description: "Type d'invitation (rôle attribué au membre)",
    example: 'PLAYER',
    enum: ['PLAYER', 'COACH'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PLAYER', 'COACH'])
  type: string;

  @ApiPropertyOptional({
    description: 'Nombre de jours avant expiration du lien (par défaut: 7)',
    example: 7,
    default: 7,
  })
  @IsNumber()
  @IsOptional()
  expirationDays?: number; // Default: 7 days
}
