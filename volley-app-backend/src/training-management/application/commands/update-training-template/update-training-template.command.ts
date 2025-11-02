import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  IsArray,
} from 'class-validator';

export class UpdateTrainingTemplateCommand {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(30)
  @Max(300)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @IsInt()
  @Min(0)
  @Max(6)
  @IsOptional()
  dayOfWeek?: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  @IsOptional()
  time?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamIds?: string[];
}

