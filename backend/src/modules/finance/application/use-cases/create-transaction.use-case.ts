import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.interface';
import type { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../../employees/domain/repositories/employee.repository.interface';
import { TransactionType } from '../../domain/entities/transaction.entity';

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  date?: string;
  employeeId?: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(input: CreateTransactionInput) {
    if (input.type === TransactionType.SALARY) {
      if (!input.employeeId) {
        throw new BadRequestException('employeeId is required for SALARY transactions');
      }
      const employee = await this.employeeRepository.findById(input.employeeId);
      if (!employee) {
        throw new NotFoundException(`Employee ${input.employeeId} not found`);
      }
    }

    return this.transactionRepository.create({
      type: input.type,
      amount: input.amount,
      description: input.description,
      date: input.date ? new Date(input.date) : undefined,
      employeeId: input.employeeId,
    });
  }
}
