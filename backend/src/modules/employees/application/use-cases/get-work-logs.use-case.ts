import { Injectable, Inject } from '@nestjs/common';
import type { IWorkLogRepository } from '../../domain/repositories/work-log.repository.interface';
import { WORK_LOG_REPOSITORY } from '../../domain/repositories/work-log.repository.interface';

@Injectable()
export class GetWorkLogsUseCase {
  constructor(
    @Inject(WORK_LOG_REPOSITORY)
    private readonly workLogRepository: IWorkLogRepository,
  ) {}

  execute(employeeId: string, year: number, month: number) {
    return this.workLogRepository.findByMonth(employeeId, year, month);
  }
}
