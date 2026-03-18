import { api } from '../../shared/api/axios';
import type { Employee, EmployeeStatus } from './types';

export const employeeApi = {
  getAll: (status?: EmployeeStatus) =>
    api.get<Employee[]>('/employees', { params: status ? { status } : {} }).then((r) => r.data),

  create: (data: { name: string; role: string; email: string; phone?: string; description?: string }) =>
    api.post<Employee>('/employees', data).then((r) => r.data),

  update: (id: string, data: Partial<{ name: string; role: string; status: EmployeeStatus; email: string; phone: string; description: string }>) =>
    api.patch<Employee>(`/employees/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/employees/${id}`),
};
