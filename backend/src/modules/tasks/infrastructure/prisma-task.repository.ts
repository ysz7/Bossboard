import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ITaskRepository, CreateTaskData, TaskFilters } from '../domain/repositories/task.repository.interface';
import { Task, TaskStatus, TaskPriority } from '../domain/entities/task.entity';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskData): Promise<Task> {
    const record = await this.prisma.task.create({ data, include: { employee: true } });
    return this.toEntity(record);
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
      },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({ where: { id }, include: { employee: true } });
    return record ? this.toEntity(record) : null;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const record = await this.prisma.task.update({
      where: { id },
      data: { status },
      include: { employee: true },
    });
    return this.toEntity(record);
  }

  async updatePriority(id: string, priority: TaskPriority): Promise<Task> {
    const record = await this.prisma.task.update({
      where: { id },
      data: { priority },
      include: { employee: true },
    });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  private toEntity(record: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    deadline: Date | null;
    employeeId: string;
    employee: { name: string };
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task(
      record.id,
      record.title,
      record.description,
      record.status as TaskStatus,
      record.priority as TaskPriority,
      record.deadline,
      record.employeeId,
      record.employee.name,
      record.createdAt,
      record.updatedAt,
    );
  }
}
