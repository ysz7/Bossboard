export type TransactionType = 'INCOME' | 'EXPENSE' | 'SALARY';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: string;
  employeeId: string | null;
  employeeName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  totalSalaries: number;
  netBalance: number;
}
