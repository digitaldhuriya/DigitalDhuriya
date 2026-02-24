import { IsNotEmpty, IsString } from 'class-validator';

export class SendWhatsappDto {
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}

