import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;
}
