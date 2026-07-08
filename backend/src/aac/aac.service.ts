import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AacService {
  private readonly openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  findCategories() {
    return this.prisma.aacCategory.findMany({ orderBy: { order: 'asc' } });
  }

  findCoreCards() {
    return this.prisma.aacCard.findMany({
      where: { isCore: true },
      orderBy: { order: 'asc' },
    });
  }

  async findCards(categoryId: string) {
    const category = await this.prisma.aacCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.aacCard.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    });
  }

  async synthesizeSpeech(text: string, voice: string): Promise<Readable> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
      response_format: 'mp3',
    });

    if (!response.body) {
      throw new Error('OpenAI returned an empty audio stream');
    }

    return Readable.fromWeb(response.body as unknown as NodeReadableStream);
  }
}
