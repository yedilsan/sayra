import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lang } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI, { toFile } from 'openai';
import { ChildrenService } from '../children/children.service';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyzePronunciationDto } from './dto/analyze-pronunciation.dto';

const WHISPER_LANGUAGE: Record<Lang, string> = {
  RU: 'ru',
  KZ: 'kk',
  JA: 'ja',
  EN: 'en',
};

interface PronunciationFeedback {
  accuracy: number;
  isCorrect: boolean;
  feedback: string;
  tips: string;
}

@Injectable()
export class PronunciationService {
  private readonly openai: OpenAI;
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly childrenService: ChildrenService,
    configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
    this.anthropic = new Anthropic({
      apiKey: configService.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
  }

  async analyze(
    userId: string,
    audio: Express.Multer.File,
    dto: AnalyzePronunciationDto,
  ) {
    await this.childrenService.findOwned(dto.childId, userId);
    const transcript = await this.transcribe(audio, dto.language);
    const feedback = await this.compare(dto.targetWord, transcript, dto.language);

    return this.prisma.pronunciationSession.create({
      data: {
        childId: dto.childId,
        targetWord: dto.targetWord,
        targetLang: dto.language,
        transcript,
        aiFeedback: JSON.stringify(feedback),
      },
    });
  }

  private async transcribe(
    audio: Express.Multer.File,
    language: Lang,
  ): Promise<string> {
    const file = await toFile(
      audio.buffer,
      audio.originalname || 'audio.webm',
      { type: audio.mimetype },
    );

    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: WHISPER_LANGUAGE[language],
    });

    return transcription.text;
  }

  private async compare(
    targetWord: string,
    transcript: string,
    language: Lang,
  ): Promise<PronunciationFeedback> {
    const message = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content:
            `A speech therapy app recorded a user trying to say the word "${targetWord}" (language: ${language}). ` +
            `Speech-to-text transcribed the recording as: "${transcript}". ` +
            'Compare the transcript with the target word and judge how accurately it was pronounced, ' +
            'accounting for likely transcription noise. Respond with ONLY a JSON object (no markdown, no extra text) ' +
            `matching this shape: {"accuracy": number between 0 and 100, "isCorrect": boolean, ` +
            `"feedback": short encouraging feedback written in ${language}, "tips": one concrete pronunciation tip written in ${language}}.`,
        },
      ],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    return this.parseFeedback(text);
  }

  private parseFeedback(text: string): PronunciationFeedback {
    const match = text.match(/\{[\s\S]*\}/);

    try {
      const parsed = JSON.parse(match ? match[0] : text) as Partial<PronunciationFeedback>;
      return {
        accuracy: typeof parsed.accuracy === 'number' ? parsed.accuracy : 0,
        isCorrect: Boolean(parsed.isCorrect),
        feedback: parsed.feedback ?? '',
        tips: parsed.tips ?? '',
      };
    } catch {
      return {
        accuracy: 0,
        isCorrect: false,
        feedback: text,
        tips: '',
      };
    }
  }
}
