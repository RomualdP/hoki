import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClubDto {
  @ApiPropertyOptional({
    description: 'Nouveau nom du club',
    example: 'Paris Volley Club Pro',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle description du club',
    example: 'Club de volleyball professionnel basé à Paris',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle URL du logo',
    example: 'https://example.com/new-logo.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle localisation du club',
    example: 'Lyon, France',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;
}
