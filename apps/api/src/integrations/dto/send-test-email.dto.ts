import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTestEmailDto {
  @IsEmail()
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsOptional()
  @IsString()
  body?: string;
}

