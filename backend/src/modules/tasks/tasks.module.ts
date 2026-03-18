import { Module } from '@nestjs/common';
import { TasksController } from './presentation/tasks.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { GetTasksUseCase } from './application/use-cases/get-tasks.use-case';
import { UpdateTaskStatusUseCase } from './application/use-cases/update-task-status.use-case';
import { UpdateTaskPriorityUseCase } from './application/use-cases/update-task-priority.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { PrismaTaskRepository } from './infrastructure/prisma-task.repository';
import { TASK_REPOSITORY } from './domain/repositories/task.repository.interface';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  // Import EmployeesModule so we can inject EMPLOYEE_REPOSITORY into CreateTaskUseCase
  imports: [EmployeesModule],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    GetTasksUseCase,
    UpdateTaskStatusUseCase,
    UpdateTaskPriorityUseCase,
    DeleteTaskUseCase,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [TASK_REPOSITORY],
})
export class TasksModule {}
