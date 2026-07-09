import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';
import { ExercisesService } from './exercises.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('types')
  findTypes() {
    return this.exercisesService.findTypes();
  }

  @Get()
  findAll(@Query('typeSlug') typeSlug?: string) {
    return this.exercisesService.findExercises(typeSlug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Body() dto: CompleteExerciseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.exercisesService.complete(
      user.userId,
      dto.childId,
      id,
      dto.durationSeconds,
    );
  }
}
