import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateEmployeeUseCase } from '../application/use-cases/create-employee.use-case';
import { GetEmployeesUseCase } from '../application/use-cases/get-employees.use-case';
import { UpdateEmployeeUseCase } from '../application/use-cases/update-employee.use-case';
import { DeleteEmployeeUseCase } from '../application/use-cases/delete-employee.use-case';
import { UpsertWorkLogUseCase } from '../application/use-cases/upsert-work-log.use-case';
import { GetWorkLogsUseCase } from '../application/use-cases/get-work-logs.use-case';
import { DeleteWorkLogUseCase } from '../application/use-cases/delete-work-log.use-case';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpsertWorkLogDto } from './dto/upsert-work-log.dto';
import { EmployeeStatus } from '../domain/entities/employee.entity';

// All employee routes require authentication
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getEmployeesUseCase: GetEmployeesUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly upsertWorkLogUseCase: UpsertWorkLogUseCase,
    private readonly getWorkLogsUseCase: GetWorkLogsUseCase,
    private readonly deleteWorkLogUseCase: DeleteWorkLogUseCase,
  ) {}

  // GET /employees?status=ACTIVE
  @Get()
  getAll(@Query('status') status?: EmployeeStatus) {
    return this.getEmployeesUseCase.execute(status);
  }

  // POST /employees
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.createEmployeeUseCase.execute(dto);
  }

  // PATCH /employees/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.updateEmployeeUseCase.execute(id, dto);
  }

  // DELETE /employees/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.deleteEmployeeUseCase.execute(id);
  }

  // GET /employees/:id/worklogs?year=2025&month=3
  @Get(':id/worklogs')
  getWorkLogs(
    @Param('id') id: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.getWorkLogsUseCase.execute(id, year, month);
  }

  // POST /employees/:id/worklogs
  @Post(':id/worklogs')
  upsertWorkLog(@Param('id') id: string, @Body() dto: UpsertWorkLogDto) {
    return this.upsertWorkLogUseCase.execute({ employeeId: id, ...dto });
  }

  // DELETE /employees/:id/worklogs/:logId
  @Delete(':id/worklogs/:logId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteWorkLog(@Param('logId') logId: string) {
    return this.deleteWorkLogUseCase.execute(logId);
  }
}
