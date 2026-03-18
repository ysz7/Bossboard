import { Module } from '@nestjs/common';
import { EmployeesController } from './presentation/employees.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { GetEmployeesUseCase } from './application/use-cases/get-employees.use-case';
import { UpdateEmployeeUseCase } from './application/use-cases/update-employee.use-case';
import { DeleteEmployeeUseCase } from './application/use-cases/delete-employee.use-case';
import { UpsertWorkLogUseCase } from './application/use-cases/upsert-work-log.use-case';
import { GetWorkLogsUseCase } from './application/use-cases/get-work-logs.use-case';
import { DeleteWorkLogUseCase } from './application/use-cases/delete-work-log.use-case';
import { PrismaEmployeeRepository } from './infrastructure/prisma-employee.repository';
import { PrismaWorkLogRepository } from './infrastructure/prisma-work-log.repository';
import { EMPLOYEE_REPOSITORY } from './domain/repositories/employee.repository.interface';
import { WORK_LOG_REPOSITORY } from './domain/repositories/work-log.repository.interface';

@Module({
  controllers: [EmployeesController],
  providers: [
    CreateEmployeeUseCase,
    GetEmployeesUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    UpsertWorkLogUseCase,
    GetWorkLogsUseCase,
    DeleteWorkLogUseCase,
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: PrismaEmployeeRepository,
    },
    {
      provide: WORK_LOG_REPOSITORY,
      useClass: PrismaWorkLogRepository,
    },
  ],
  exports: [EMPLOYEE_REPOSITORY],
})
export class EmployeesModule {}
