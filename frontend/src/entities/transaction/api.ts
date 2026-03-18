import { api } from '../../shared/api/axios';
import type { Transaction, TransactionType, FinanceStats } from './types';

export const transactionApi = {
  getAll: (type?: TransactionType) =>
    api.get<Transaction[]>('/finance', { params: type ? { type } : {} }).then((r) => r.data),

  create: (data: { type: TransactionType; amount: number; description?: string; date?: string; employeeId?: string }) =>
    api.post<Transaction>('/finance', data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/finance/${id}`),

  getStats: () =>
    api.get<FinanceStats>('/finance/stats').then((r) => r.data),
};
