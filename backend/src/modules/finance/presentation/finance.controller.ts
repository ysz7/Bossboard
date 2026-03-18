import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { GetTransactionsUseCase } from '../application/use-cases/get-transactions.use-case';
import { DeleteTransactionUseCase } from '../application/use-cases/delete-transaction.use-case';
import { GetFinanceStatsUseCase } from '../application/use-cases/get-finance-stats.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '../domain/entities/transaction.entity';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly getFinanceStatsUseCase: GetFinanceStatsUseCase,
  ) {}

  @Get('stats')
  getStats() {
    return this.getFinanceStatsUseCase.execute();
  }

  @Get()
  getAll(@Query('type') type?: TransactionType) {
    return this.getTransactionsUseCase.execute(type);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.deleteTransactionUseCase.execute(id);
  }
}
