// Task domain entity
// Pure TypeScript — no framework or library dependencies

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly deadline: Date | null,
    public readonly employeeId: string,
    public readonly employeeName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
