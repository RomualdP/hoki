import { IsString, IsNotEmpty } from 'class-validator';

export class GetTrainingQuery {
  @IsString()
  @IsNotEmpty()
  id: string;
}
