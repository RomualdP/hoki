import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterToTrainingDto {
  @IsString()
  @IsNotEmpty()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
