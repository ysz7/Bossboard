import { Transaction, TransactionType } from '../entities/transaction.entity';

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  description?: string;
  date?: Date;
  employeeId?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  totalSalaries: number;
  netBalance: number;
}

export interface ITransactionRepository {
  create(data: CreateTransactionData): Promise<Transaction>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
  getStats(): Promise<FinanceStats>;
}

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';
