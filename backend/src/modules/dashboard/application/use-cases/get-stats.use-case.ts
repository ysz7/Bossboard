import { Injectable, Inject } from '@nestjs/common';
import { EMPLOYEE_REPOSITORY } from '../../../employees/domain/repositories/employee.repository.interface';
import type { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { EmployeeStatus } from '../../../employees/domain/entities/employee.entity';
import { TASK_REPOSITORY } from '../../../tasks/domain/repositories/task.repository.interface';
import type { ITaskRepository } from '../../../tasks/domain/repositories/task.repository.interface';
import { TaskStatus } from '../../../tasks/domain/entities/task.entity';

export interface DashboardStats {
  employees: {
    total: number;
    active: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    dueSoon: number; // deadline within the next 7 days
  };
}

@Injectable()
export class GetStatsUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(): Promise<DashboardStats> {
    // Fetch all data in parallel for better performance
    const [employees, tasks] = await Promise.all([
      this.employeeRepository.findAll(),
      this.taskRepository.findAll(),
    ]);

    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      employees: {
        total: employees.length,
        active: employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length,
      },
      tasks: {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
        inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
        // Tasks with a deadline set and that deadline is within the next 7 days
        dueSoon: tasks.filter(
          (t) => t.deadline && t.deadline > now && t.deadline <= in7Days,
        ).length,
      },
    };
  }
}
