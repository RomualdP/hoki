import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterUserToTrainingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
