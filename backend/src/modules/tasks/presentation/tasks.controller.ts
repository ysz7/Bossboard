import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { GetTasksUseCase } from '../application/use-cases/get-tasks.use-case';
import { UpdateTaskStatusUseCase } from '../application/use-cases/update-task-status.use-case';
import { UpdateTaskPriorityUseCase } from '../application/use-cases/update-task-priority.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { TaskStatus } from '../domain/entities/task.entity';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private readonly updateTaskPriorityUseCase: UpdateTaskPriorityUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get()
  getAll(@Query('status') status?: TaskStatus, @Query('employeeId') employeeId?: string) {
    return this.getTasksUseCase.execute({ status, employeeId });
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.createTaskUseCase.execute({
      ...dto,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    });
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.updateTaskStatusUseCase.execute(id, dto.status);
  }

  @Patch(':id/priority')
  updatePriority(@Param('id') id: string, @Body() dto: UpdateTaskPriorityDto) {
    return this.updateTaskPriorityUseCase.execute(id, dto.priority);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.deleteTaskUseCase.execute(id);
  }
}
