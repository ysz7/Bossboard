import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../domain/repositories/employee.repository.interface';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    await this.employeeRepository.delete(id);
  }
}
