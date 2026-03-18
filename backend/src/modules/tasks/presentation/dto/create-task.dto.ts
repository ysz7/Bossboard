import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, MinLength } from 'class-validator';
import { TaskPriority } from '../../domain/entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsUUID()
  employeeId: string;
}
