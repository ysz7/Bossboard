export class WorkLog {
  constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly date: Date,
    public readonly hours: number,
    public readonly note: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
