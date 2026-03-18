import { Injectable, Inject } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../domain/repositories/employee.repository.interface';
import { Employee, EmployeeStatus } from '../../domain/entities/employee.entity';

@Injectable()
export class GetEmployeesUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(status?: EmployeeStatus): Promise<Employee[]> {
    return this.employeeRepository.findAll(status);
  }
}
