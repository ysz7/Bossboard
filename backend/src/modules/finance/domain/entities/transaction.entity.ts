export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SALARY = 'SALARY',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly description: string | null,
    public readonly date: Date,
    public readonly employeeId: string | null,
    public readonly employeeName: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
