import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../domain/repositories/employee.repository.interface';
import { Employee } from '../../domain/entities/employee.entity';

interface CreateEmployeeInput {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(input: CreateEmployeeInput): Promise<Employee> {
    // Check if employee with this email already exists — single DB query via WHERE email = ?
    const existing = await this.employeeRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Employee with this email already exists');
    }

    return this.employeeRepository.create(input);
  }
}
