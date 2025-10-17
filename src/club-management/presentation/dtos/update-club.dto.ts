import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;
}
