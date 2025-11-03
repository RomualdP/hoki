import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingTemplateDto {
  @ApiProperty({ description: 'Template title', example: 'Weekly Training' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Template description',
    example: 'Regular weekly training session',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 120,
    minimum: 30,
    maximum: 300,
  })
  @IsInt()
  @Min(30)
  @Max(300)
  duration: number;

  @ApiPropertyOptional({
    description: 'Training location',
    example: 'Main Gym',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum participants',
    example: 20,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({
    description: 'Day of week (0=Monday, 6=Sunday)',
    example: 2,
    minimum: 0,
    maximum: 6,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'Time in HH:mm format',
    example: '18:30',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  time: string;

  @ApiPropertyOptional({
    description: 'Is template active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Team IDs associated with template',
    example: ['team-id-1', 'team-id-2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamIds?: string[];
}
