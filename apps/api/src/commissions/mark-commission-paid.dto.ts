import { IsDateString, IsOptional } from 'class-validator';

export class MarkCommissionPaidDto {
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}

