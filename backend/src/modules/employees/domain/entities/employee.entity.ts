// Employee domain entity
// Pure TypeScript — no framework or library dependencies

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly role: string,
    public readonly status: EmployeeStatus,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
