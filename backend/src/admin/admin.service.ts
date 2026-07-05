import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAacCardDto } from './dto/create-aac-card.dto';
import { CreateAacCategoryDto } from './dto/create-aac-category.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateAacCardDto } from './dto/update-aac-card.dto';
import { UpdateAacCategoryDto } from './dto/update-aac-category.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // AAC categories

  findAacCategories() {
    return this.prisma.aacCategory.findMany({ orderBy: { order: 'asc' } });
  }

  async findAacCategory(id: string) {
    const category = await this.prisma.aacCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('AAC category not found');
    }
    return category;
  }

  createAacCategory(dto: CreateAacCategoryDto) {
    return this.prisma.aacCategory.create({ data: dto });
  }

  async updateAacCategory(id: string, dto: UpdateAacCategoryDto) {
    await this.findAacCategory(id);
    return this.prisma.aacCategory.update({ where: { id }, data: dto });
  }

  async removeAacCategory(id: string) {
    await this.findAacCategory(id);
    await this.runDelete(
      () => this.prisma.aacCategory.delete({ where: { id } }),
      'Cannot delete a category that still has cards',
    );
  }

  // AAC cards

  findAacCards(categoryId?: string) {
    return this.prisma.aacCard.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findAacCard(id: string) {
    const card = await this.prisma.aacCard.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException('AAC card not found');
    }
    return card;
  }

  async createAacCard(dto: CreateAacCardDto) {
    await this.findAacCategory(dto.categoryId);
    return this.prisma.aacCard.create({ data: dto });
  }

  async updateAacCard(id: string, dto: UpdateAacCardDto) {
    await this.findAacCard(id);
    if (dto.categoryId) {
      await this.findAacCategory(dto.categoryId);
    }
    return this.prisma.aacCard.update({ where: { id }, data: dto });
  }

  async removeAacCard(id: string) {
    await this.findAacCard(id);
    await this.prisma.aacCard.delete({ where: { id } });
  }

  // Exercises

  findExercises(typeId?: string) {
    return this.prisma.exercise.findMany({
      where: typeId ? { typeId } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findExercise(id: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  private async findExerciseType(id: string) {
    const type = await this.prisma.exerciseType.findUnique({ where: { id } });
    if (!type) {
      throw new NotFoundException('Exercise type not found');
    }
    return type;
  }

  async createExercise(dto: CreateExerciseDto) {
    await this.findExerciseType(dto.typeId);
    return this.prisma.exercise.create({ data: dto });
  }

  async updateExercise(id: string, dto: UpdateExerciseDto) {
    await this.findExercise(id);
    if (dto.typeId) {
      await this.findExerciseType(dto.typeId);
    }
    return this.prisma.exercise.update({ where: { id }, data: dto });
  }

  async removeExercise(id: string) {
    await this.findExercise(id);
    await this.runDelete(
      () => this.prisma.exercise.delete({ where: { id } }),
      'Cannot delete an exercise that has completed sessions',
    );
  }

  // Specialists

  findSpecialists() {
    return this.prisma.specialist.findMany({ orderBy: { name: 'asc' } });
  }

  async findSpecialist(id: string) {
    const specialist = await this.prisma.specialist.findUnique({
      where: { id },
    });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }
    return specialist;
  }

  createSpecialist(dto: CreateSpecialistDto) {
    return this.prisma.specialist.create({ data: dto });
  }

  async updateSpecialist(id: string, dto: UpdateSpecialistDto) {
    await this.findSpecialist(id);
    return this.prisma.specialist.update({ where: { id }, data: dto });
  }

  async removeSpecialist(id: string) {
    await this.findSpecialist(id);
    await this.prisma.specialist.delete({ where: { id } });
  }

  private async runDelete(
    deleteFn: () => Promise<unknown>,
    conflictMessage: string,
  ) {
    try {
      await deleteFn();
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new ConflictException(conflictMessage);
      }
      throw error;
    }
  }

  private isForeignKeyViolation(error: unknown): boolean {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return true;
    }
    // Our schema enforces onDelete: Restrict at the database level, so
    // Postgres rejects the delete directly and Prisma surfaces it as a
    // generic/unknown error rather than the known P2003 request error.
    return (
      error instanceof Error && /foreign key constraint/i.test(error.message)
    );
  }
}
