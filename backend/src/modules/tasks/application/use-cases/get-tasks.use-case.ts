import { Injectable, Inject } from '@nestjs/common';
import { TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import type { ITaskRepository, TaskFilters } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class GetTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(filters?: TaskFilters): Promise<Task[]> {
    return this.taskRepository.findAll(filters);
  }
}
