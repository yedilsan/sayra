import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByParent(parentId: string) {
    return this.prisma.child.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOwned(id: string, parentId: string) {
    const child = await this.prisma.child.findFirst({
      where: { id, parentId },
    });
    if (!child) {
      throw new NotFoundException('Child not found');
    }
    return child;
  }

  create(parentId: string, dto: CreateChildDto) {
    return this.prisma.child.create({ data: { ...dto, parentId } });
  }

  async update(id: string, parentId: string, dto: UpdateChildDto) {
    await this.findOwned(id, parentId);
    return this.prisma.child.update({ where: { id }, data: dto });
  }

  async remove(id: string, parentId: string) {
    await this.findOwned(id, parentId);
    await this.prisma.child.delete({ where: { id } });
  }
}
