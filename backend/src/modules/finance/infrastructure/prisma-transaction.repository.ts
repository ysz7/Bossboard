import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ITransactionRepository, CreateTransactionData, TransactionFilters, FinanceStats } from '../domain/repositories/transaction.repository.interface';
import { Transaction, TransactionType } from '../domain/entities/transaction.entity';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<Transaction> {
    const record = await this.prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date ?? new Date(),
        employeeId: data.employeeId,
      },
      include: { employee: true },
    });
    return this.toEntity(record);
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const records = await this.prisma.transaction.findMany({
      where: filters?.type ? { type: filters.type } : undefined,
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findUnique({
      where: { id },
      include: { employee: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  async getStats(): Promise<FinanceStats> {
    const [income, expense, salary] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'SALARY' },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpenses = Number(expense._sum.amount ?? 0);
    const totalSalaries = Number(salary._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpenses,
      totalSalaries,
      netBalance: totalIncome - totalExpenses - totalSalaries,
    };
  }

  private toEntity(record: {
    id: string;
    type: string;
    amount: object;
    description: string | null;
    date: Date;
    employeeId: string | null;
    employee: { name: string } | null;
    createdAt: Date;
    updatedAt: Date;
  }): Transaction {
    return new Transaction(
      record.id,
      record.type as TransactionType,
      Number(record.amount),
      record.description,
      record.date,
      record.employeeId,
      record.employee?.name ?? null,
      record.createdAt,
      record.updatedAt,
    );
  }
}
