import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FindSpecialistsDto } from './dto/find-specialists.dto';
import { SpecialistsService } from './specialists.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Get()
  findAll(@Query() dto: FindSpecialistsDto) {
    return this.specialistsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialistsService.findOne(id);
  }
}
