import { IsString, IsNotEmpty } from 'class-validator';

export class GetTrainingTemplateQuery {
  @IsString()
  @IsNotEmpty()
  id: string;
}
