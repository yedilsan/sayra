import { Injectable } from '@nestjs/common';
import { ChildrenService } from '../children/children.service';
import { PrismaService } from '../prisma/prisma.service';

const SESSIONS_LIMIT = 50;

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly childrenService: ChildrenService,
  ) {}

  async getSummary(userId: string, childId: string) {
    await this.childrenService.findOwned(childId, userId);

    const [exerciseStats, pronunciationSessions] = await Promise.all([
      this.prisma.exerciseSession.aggregate({
        where: { childId },
        _count: { _all: true },
        _sum: { durationSeconds: true },
      }),
      this.prisma.pronunciationSession.findMany({
        where: { childId },
        select: { aiFeedback: true },
      }),
    ]);

    const accuracies = pronunciationSessions
      .map((session) => this.parseAccuracy(session.aiFeedback))
      .filter((accuracy): accuracy is number => accuracy !== null);

    return {
      exercisesCompleted: exerciseStats._count._all,
      totalPracticeSeconds: exerciseStats._sum.durationSeconds ?? 0,
      pronunciationAttempts: pronunciationSessions.length,
      averagePronunciationAccuracy:
        accuracies.length > 0
          ? Math.round(
              accuracies.reduce((sum, value) => sum + value, 0) /
                accuracies.length,
            )
          : null,
    };
  }

  async getSessions(userId: string, childId: string) {
    await this.childrenService.findOwned(childId, userId);

    const [exerciseSessions, pronunciationSessions] = await Promise.all([
      this.prisma.exerciseSession.findMany({
        where: { childId },
        include: { exercise: true },
        orderBy: { completedAt: 'desc' },
        take: SESSIONS_LIMIT,
      }),
      this.prisma.pronunciationSession.findMany({
        where: { childId },
        orderBy: { createdAt: 'desc' },
        take: SESSIONS_LIMIT,
      }),
    ]);

    const sessions = [
      ...exerciseSessions.map((session) => ({
        type: 'EXERCISE' as const,
        occurredAt: session.completedAt,
        ...session,
      })),
      ...pronunciationSessions.map((session) => ({
        type: 'PRONUNCIATION' as const,
        occurredAt: session.createdAt,
        ...session,
      })),
    ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());

    return sessions.slice(0, SESSIONS_LIMIT);
  }

  private parseAccuracy(aiFeedback: string | null): number | null {
    if (!aiFeedback) {
      return null;
    }

    try {
      const parsed = JSON.parse(aiFeedback) as { accuracy?: number };
      return typeof parsed.accuracy === 'number' ? parsed.accuracy : null;
    } catch {
      return null;
    }
  }
}
