import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IWorkLogRepository, UpsertWorkLogData } from '../domain/repositories/work-log.repository.interface';
import { WorkLog } from '../domain/entities/work-log.entity';

@Injectable()
export class PrismaWorkLogRepository implements IWorkLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: UpsertWorkLogData): Promise<WorkLog> {
    const record = await this.prisma.workLog.upsert({
      where: { employeeId_date: { employeeId: data.employeeId, date: data.date } },
      create: {
        employeeId: data.employeeId,
        date: data.date,
        hours: data.hours,
        note: data.note,
      },
      update: {
        hours: data.hours,
        note: data.note,
      },
    });
    return this.toEntity(record);
  }

  async findByMonth(employeeId: string, year: number, month: number): Promise<WorkLog[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const records = await this.prisma.workLog.findMany({
      where: { employeeId, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workLog.delete({ where: { id } });
  }

  private toEntity(record: {
    id: string;
    employeeId: string;
    date: Date;
    hours: object;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): WorkLog {
    return new WorkLog(
      record.id,
      record.employeeId,
      record.date,
      Number(record.hours),
      record.note,
      record.createdAt,
      record.updatedAt,
    );
  }
}
