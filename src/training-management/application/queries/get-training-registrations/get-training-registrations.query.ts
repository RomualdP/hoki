import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTrainingRegistrationsQuery {
  @IsString()
  @IsNotEmpty()
  trainingId: string;

  @IsString()
  @IsOptional()
  status?: string;
}
