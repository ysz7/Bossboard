import { api } from '../../shared/api/axios';
import type { Task, TaskStatus, TaskPriority } from './types';

export const taskApi = {
  getAll: (filters?: { status?: TaskStatus; employeeId?: string }) =>
    api.get<Task[]>('/tasks', { params: filters }).then((r) => r.data),

  create: (data: { title: string; description?: string; priority?: TaskPriority; deadline?: string; employeeId: string }) =>
    api.post<Task>('/tasks', data).then((r) => r.data),

  updateStatus: (id: string, status: TaskStatus) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }).then((r) => r.data),

  updatePriority: (id: string, priority: TaskPriority) =>
    api.patch<Task>(`/tasks/${id}/priority`, { priority }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),
};
