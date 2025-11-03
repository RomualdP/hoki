import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingTemplateDto {
  @ApiPropertyOptional({ description: 'Template title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    minimum: 30,
    maximum: 300,
  })
  @IsInt()
  @Min(30)
  @Max(300)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Training location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum participants',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiPropertyOptional({
    description: 'Day of week (0=Monday, 6=Sunday)',
    minimum: 0,
    maximum: 6,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  @IsOptional()
  dayOfWeek?: number;

  @ApiPropertyOptional({
    description: 'Time in HH:mm format',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  @IsOptional()
  time?: string;

  @ApiPropertyOptional({ description: 'Is template active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Team IDs associated with template',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamIds?: string[];
}
