import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IEmployeeRepository, UpdateEmployeeData } from '../../domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../domain/repositories/employee.repository.interface';
import { Employee } from '../../domain/entities/employee.entity';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return this.employeeRepository.update(id, data);
  }
}
