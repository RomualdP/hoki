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

export class CreateTrainingTemplateCommand {
  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(30)
  @Max(300)
  duration: number;

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
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  time: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamIds?: string[];
}
