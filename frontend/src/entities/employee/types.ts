export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  email: string;
  phone: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
