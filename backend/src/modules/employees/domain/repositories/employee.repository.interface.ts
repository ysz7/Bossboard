// IEmployeeRepository — contract that infrastructure must implement
// Application layer depends only on this interface, never on Prisma directly

import { Employee, EmployeeStatus } from '../entities/employee.entity';

export interface CreateEmployeeData {
  name: string;
  role: string;
  email: string;
  phone?: string;
  description?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  role?: string;
  status?: EmployeeStatus;
  email?: string;
  phone?: string;
  description?: string;
}

export interface IEmployeeRepository {
  create(data: CreateEmployeeData): Promise<Employee>;
  findAll(status?: EmployeeStatus): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  update(id: string, data: UpdateEmployeeData): Promise<Employee>;
  delete(id: string): Promise<void>;
}

export const EMPLOYEE_REPOSITORY = 'EMPLOYEE_REPOSITORY';
