import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/dashboard.controller';
import { GetStatsUseCase } from './application/use-cases/get-stats.use-case';
import { EmployeesModule } from '../employees/employees.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  // Import both modules to get access to their exported repositories
  imports: [EmployeesModule, TasksModule],
  controllers: [DashboardController],
  providers: [GetStatsUseCase],
})
export class DashboardModule {}
