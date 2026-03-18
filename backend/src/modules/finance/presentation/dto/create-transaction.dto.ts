import { IsEnum, IsNumber, IsOptional, IsString, IsPositive, IsDateString, IsUUID } from 'class-validator';
import { TransactionType } from '../../domain/entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
