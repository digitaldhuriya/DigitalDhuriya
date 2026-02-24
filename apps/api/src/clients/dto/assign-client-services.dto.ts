import { IsArray, IsString } from 'class-validator';

export class AssignClientServicesDto {
  @IsArray()
  @IsString({ each: true })
  serviceIds!: string[];
}

