// PrismaEmployeeRepository — implements IEmployeeRepository using Prisma
// This is the only place in the employees module that knows about Prisma

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IEmployeeRepository, CreateEmployeeData, UpdateEmployeeData } from '../domain/repositories/employee.repository.interface';
import { Employee, EmployeeStatus } from '../domain/entities/employee.entity';

@Injectable()
export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeData): Promise<Employee> {
    const record = await this.prisma.employee.create({ data });
    return this.toEntity(record);
  }

  async findAll(status?: EmployeeStatus): Promise<Employee[]> {
    const records = await this.prisma.employee.findMany({
      // If status filter is provided, use it; otherwise return all
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Employee | null> {
    const record = await this.prisma.employee.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const record = await this.prisma.employee.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const record = await this.prisma.employee.update({ where: { id }, data });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({ where: { id } });
  }

  // Maps a raw Prisma record to the domain Employee entity
  private toEntity(record: {
    id: string;
    name: string;
    role: string;
    status: string;
    email: string;
    phone: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Employee {
    return new Employee(
      record.id,
      record.name,
      record.role,
      record.status as EmployeeStatus,
      record.email,
      record.phone,
      record.description,
      record.createdAt,
      record.updatedAt,
    );
  }
}
