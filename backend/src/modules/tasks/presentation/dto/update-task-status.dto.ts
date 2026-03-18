import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../domain/entities/task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
