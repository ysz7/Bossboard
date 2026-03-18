export interface WorkLog {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
