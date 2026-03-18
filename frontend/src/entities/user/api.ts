import { api } from '../../shared/api/axios';

interface AuthResponse {
  accessToken: string;
}

export const dashboardApi = {
  getStats: () =>
    api.get<{
      employees: { total: number; active: number };
      tasks: { total: number; todo: number; inProgress: number; done: number; dueSoon: number };
    }>('/dashboard/stats').then((r) => r.data),
};

export const userApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),

  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, password }).then((r) => r.data),

  getMe: () =>
    api.get<{ id: string; email: string }>('/auth/me').then((r) => r.data),
};
