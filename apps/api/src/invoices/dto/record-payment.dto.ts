import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class RecordPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}

