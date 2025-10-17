import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

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
