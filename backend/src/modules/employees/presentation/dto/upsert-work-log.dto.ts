import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class UpsertWorkLogDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @IsPositive()
  @Max(24)
  hours: number;

  @IsOptional()
  @IsString()
  note?: string;
}
