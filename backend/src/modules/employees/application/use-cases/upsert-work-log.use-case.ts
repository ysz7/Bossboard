import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IWorkLogRepository } from '../../domain/repositories/work-log.repository.interface';
import { WORK_LOG_REPOSITORY } from '../../domain/repositories/work-log.repository.interface';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../domain/repositories/employee.repository.interface';

export interface UpsertWorkLogInput {
  employeeId: string;
  date: string;
  hours: number;
  note?: string;
}

@Injectable()
export class UpsertWorkLogUseCase {
  constructor(
    @Inject(WORK_LOG_REPOSITORY)
    private readonly workLogRepository: IWorkLogRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(input: UpsertWorkLogInput) {
    const employee = await this.employeeRepository.findById(input.employeeId);
    if (!employee) throw new NotFoundException(`Employee ${input.employeeId} not found`);
    return this.workLogRepository.upsert({
      employeeId: input.employeeId,
      date: new Date(input.date),
      hours: input.hours,
      note: input.note,
    });
  }
}
