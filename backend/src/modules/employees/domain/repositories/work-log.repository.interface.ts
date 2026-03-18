import { WorkLog } from '../entities/work-log.entity';

export interface UpsertWorkLogData {
  employeeId: string;
  date: Date;
  hours: number;
  note?: string;
}

export interface IWorkLogRepository {
  upsert(data: UpsertWorkLogData): Promise<WorkLog>;
  findByMonth(employeeId: string, year: number, month: number): Promise<WorkLog[]>;
  delete(id: string): Promise<void>;
}

export const WORK_LOG_REPOSITORY = 'WORK_LOG_REPOSITORY';
