import { api } from '../../shared/api/axios';
import type { WorkLog } from './types';

export const workLogApi = {
  getByMonth: (employeeId: string, year: number, month: number) =>
    api.get<WorkLog[]>(`/employees/${employeeId}/worklogs`, { params: { year, month } }).then((r) => r.data),

  upsert: (employeeId: string, data: { date: string; hours: number; note?: string }) =>
    api.post<WorkLog>(`/employees/${employeeId}/worklogs`, data).then((r) => r.data),

  delete: (employeeId: string, logId: string) =>
    api.delete(`/employees/${employeeId}/worklogs/${logId}`),
};
