import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import { TaskPriority } from '../../domain/entities/task.entity';

@Injectable()
export class UpdateTaskPriorityUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: string, priority: TaskPriority) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return this.taskRepository.updatePriority(id, priority);
  }
}
