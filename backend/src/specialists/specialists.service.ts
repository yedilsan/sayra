import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindSpecialistsDto } from './dto/find-specialists.dto';

@Injectable()
export class SpecialistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(dto: FindSpecialistsDto) {
    return this.prisma.specialist.findMany({
      where: {
        city: dto.city ? { equals: dto.city, mode: 'insensitive' } : undefined,
        specializations: dto.specialization
          ? { has: dto.specialization }
          : undefined,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialist = await this.prisma.specialist.findUnique({
      where: { id },
    });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }
    return specialist;
  }
}
