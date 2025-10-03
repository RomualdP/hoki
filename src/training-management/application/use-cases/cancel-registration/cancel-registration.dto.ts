import { IsString, IsNotEmpty } from 'class-validator';

export class CancelRegistrationDto {
  @IsString()
  @IsNotEmpty()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
