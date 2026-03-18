import { Module } from '@nestjs/common';
import { FinanceController } from './presentation/finance.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionsUseCase } from './application/use-cases/get-transactions.use-case';
import { DeleteTransactionUseCase } from './application/use-cases/delete-transaction.use-case';
import { GetFinanceStatsUseCase } from './application/use-cases/get-finance-stats.use-case';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository.interface';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [EmployeesModule],
  controllers: [FinanceController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    DeleteTransactionUseCase,
    GetFinanceStatsUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class FinanceModule {}
