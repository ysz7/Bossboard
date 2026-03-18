import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { EmployeesPage } from '@/pages/employees/EmployeesPage';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { FinancePage } from '@/pages/finance/FinancePage';
import { Sidebar } from '@/widgets/sidebar/Sidebar';

function ProtectedLayout() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/tasks', element: <TasksPage /> },
      { path: '/finance', element: <FinancePage /> },
      { path: '/', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
