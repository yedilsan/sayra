import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateAacCardDto } from './dto/create-aac-card.dto';
import { CreateAacCategoryDto } from './dto/create-aac-category.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateAacCardDto } from './dto/update-aac-card.dto';
import { UpdateAacCategoryDto } from './dto/update-aac-category.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // AAC categories

  @Get('aac-categories')
  findAacCategories() {
    return this.adminService.findAacCategories();
  }

  @Get('aac-categories/:id')
  findAacCategory(@Param('id') id: string) {
    return this.adminService.findAacCategory(id);
  }

  @Post('aac-categories')
  createAacCategory(@Body() dto: CreateAacCategoryDto) {
    return this.adminService.createAacCategory(dto);
  }

  @Patch('aac-categories/:id')
  updateAacCategory(
    @Param('id') id: string,
    @Body() dto: UpdateAacCategoryDto,
  ) {
    return this.adminService.updateAacCategory(id, dto);
  }

  @Delete('aac-categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAacCategory(@Param('id') id: string) {
    return this.adminService.removeAacCategory(id);
  }

  // AAC cards

  @Get('aac-cards')
  findAacCards(@Query('categoryId') categoryId?: string) {
    return this.adminService.findAacCards(categoryId);
  }

  @Get('aac-cards/:id')
  findAacCard(@Param('id') id: string) {
    return this.adminService.findAacCard(id);
  }

  @Post('aac-cards')
  createAacCard(@Body() dto: CreateAacCardDto) {
    return this.adminService.createAacCard(dto);
  }

  @Patch('aac-cards/:id')
  updateAacCard(@Param('id') id: string, @Body() dto: UpdateAacCardDto) {
    return this.adminService.updateAacCard(id, dto);
  }

  @Delete('aac-cards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAacCard(@Param('id') id: string) {
    return this.adminService.removeAacCard(id);
  }

  // Exercises

  @Get('exercises')
  findExercises(@Query('typeId') typeId?: string) {
    return this.adminService.findExercises(typeId);
  }

  @Get('exercises/:id')
  findExercise(@Param('id') id: string) {
    return this.adminService.findExercise(id);
  }

  @Post('exercises')
  createExercise(@Body() dto: CreateExerciseDto) {
    return this.adminService.createExercise(dto);
  }

  @Patch('exercises/:id')
  updateExercise(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.adminService.updateExercise(id, dto);
  }

  @Delete('exercises/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeExercise(@Param('id') id: string) {
    return this.adminService.removeExercise(id);
  }

  // Specialists

  @Get('specialists')
  findSpecialists() {
    return this.adminService.findSpecialists();
  }

  @Get('specialists/:id')
  findSpecialist(@Param('id') id: string) {
    return this.adminService.findSpecialist(id);
  }

  @Post('specialists')
  createSpecialist(@Body() dto: CreateSpecialistDto) {
    return this.adminService.createSpecialist(dto);
  }

  @Patch('specialists/:id')
  updateSpecialist(@Param('id') id: string, @Body() dto: UpdateSpecialistDto) {
    return this.adminService.updateSpecialist(id, dto);
  }

  @Delete('specialists/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSpecialist(@Param('id') id: string) {
    return this.adminService.removeSpecialist(id);
  }
}
