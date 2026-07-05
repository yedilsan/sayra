import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Lang, MessageRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ChatDto } from './dto/chat.dto';

const HISTORY_LIMIT = 20;

const SYSTEM_PROMPT: Record<Lang, string> = {
  RU: 'Ты — дружелюбный ассистент в приложении Sayra, которое помогает детям с логопедическими упражнениями. Отвечай кратко, тепло и по-русски, давай практичные советы родителям и детям.',
  KZ: 'Сен — Sayra қосымшасындағы достық көмекші, ол балаларға логопедиялық жаттығуларда көмектеседі. Қысқа, жылы және қазақ тілінде жауап бер, ата-аналар мен балаларға практикалық кеңестер бер.',
  JA: 'あなたはSayraアプリのフレンドリーなアシスタントで、子どもの言語療法の練習を支援します。日本語で、簡潔かつ温かく、保護者や子どもに実用的なアドバイスをしてください。',
  EN: 'You are a friendly assistant in the Sayra app, which helps children with speech therapy exercises. Reply briefly and warmly in English, giving practical advice to parents and children.',
};

@Injectable()
export class AiService {
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: configService.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
  }

  async chat(userId: string, dto: ChatDto) {
    const user = await this.usersService.findById(userId);
    const language = user?.language ?? Lang.RU;

    const recentHistory = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_LIMIT,
    });

    const conversation: Anthropic.MessageParam[] = [
      ...recentHistory.reverse().map((entry) => ({
        role:
          entry.role === MessageRole.USER
            ? ('user' as const)
            : ('assistant' as const),
        content: entry.content,
      })),
      { role: 'user' as const, content: dto.message },
    ];

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT[language],
      messages: conversation,
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    await this.prisma.chatMessage.createMany({
      data: [
        { userId, role: MessageRole.USER, content: dto.message },
        { userId, role: MessageRole.ASSISTANT, content: reply },
      ],
    });

    return { reply };
  }
}
