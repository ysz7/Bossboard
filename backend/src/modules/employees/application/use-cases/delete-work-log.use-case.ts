import { Injectable, Inject } from '@nestjs/common';
import type { IWorkLogRepository } from '../../domain/repositories/work-log.repository.interface';
import { WORK_LOG_REPOSITORY } from '../../domain/repositories/work-log.repository.interface';

@Injectable()
export class DeleteWorkLogUseCase {
  constructor(
    @Inject(WORK_LOG_REPOSITORY)
    private readonly workLogRepository: IWorkLogRepository,
  ) {}

  execute(id: string) {
    return this.workLogRepository.delete(id);
  }
}
