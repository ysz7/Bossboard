import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: Date;
  employeeId: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  employeeId?: string;
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<Task>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus): Promise<Task>;
  updatePriority(id: string, priority: TaskPriority): Promise<Task>;
  delete(id: string): Promise<void>;
}

export const TASK_REPOSITORY = 'TASK_REPOSITORY';
