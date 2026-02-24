import { IsString, MaxLength } from 'class-validator';

export class CreateLeadNoteDto {
  @IsString()
  @MaxLength(2000)
  content!: string;
}

