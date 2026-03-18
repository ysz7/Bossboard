import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import type { ITaskRepository, CreateTaskData } from '../../domain/repositories/task.repository.interface';
import { EMPLOYEE_REPOSITORY } from '../../../employees/domain/repositories/employee.repository.interface';
import type { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { Task, TaskPriority } from '../../domain/entities/task.entity';

interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: Date;
  employeeId: string;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
    // Cross-module dependency: we need EmployeeRepository to validate employeeId
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    // Verify the employee exists before assigning a task to them
    const employee = await this.employeeRepository.findById(input.employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${input.employeeId} not found`);
    }

    const data: CreateTaskData = {
      title: input.title,
      description: input.description,
      priority: input.priority,
      deadline: input.deadline,
      employeeId: input.employeeId,
    };

    return this.taskRepository.create(data);
  }
}
