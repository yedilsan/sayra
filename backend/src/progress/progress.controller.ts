import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.progressService.getSummary(user.userId);
  }

  @Get('me/sessions')
  getSessions(@CurrentUser() user: JwtPayload) {
    return this.progressService.getSessions(user.userId);
  }
}
