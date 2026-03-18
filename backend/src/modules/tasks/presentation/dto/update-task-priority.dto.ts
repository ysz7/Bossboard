import { IsEnum } from 'class-validator';
import { TaskPriority } from '../../domain/entities/task.entity';

export class UpdateTaskPriorityDto {
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
