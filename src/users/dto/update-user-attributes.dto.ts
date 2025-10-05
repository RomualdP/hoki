import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateUserAttributesDto {
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(2.0)
  fitness?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(2.0)
  leadership?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
