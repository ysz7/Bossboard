import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { GetStatsUseCase } from '../application/use-cases/get-stats.use-case';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getStatsUseCase: GetStatsUseCase) {}

  @Get('stats')
  getStats() {
    return this.getStatsUseCase.execute();
  }
}
