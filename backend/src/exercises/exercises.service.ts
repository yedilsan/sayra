import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  findTypes() {
    return this.prisma.exerciseType.findMany();
  }

  findExercises(typeSlug?: string) {
    return this.prisma.exercise.findMany({
      where: typeSlug ? { type: { slug: typeSlug } } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async complete(userId: string, exerciseId: string, durationSeconds: number) {
    await this.findOne(exerciseId);
    return this.prisma.exerciseSession.create({
      data: { userId, exerciseId, durationSeconds },
    });
  }
}
