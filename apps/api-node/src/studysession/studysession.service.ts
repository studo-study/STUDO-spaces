import { Injectable, NotFoundException } from '@nestjs/common';
import {
  StudysessionListResponseDto,
  StudysessionResponseDto,
  UpdateStudysessionDto,
} from './studysession.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { and, eq } from 'drizzle-orm';
import {
  sessioncards,
  sessionpins,
  studysessions,
  users,
} from '../drizzle/schema';
import { SessionCardResponseDTO } from './sessioncard.dto';
import { SessionPinResponseDTO } from './sessionpin.dto';

@Injectable()
export class StudysessionService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  /** Load the pins and cards belonging to a session. */
  private async loadSessionChildren(sessionId: string) {
    const [pins, cards] = await Promise.all([
      this.db.query.sessionpins.findMany({
        where: eq(sessionpins.sessionId, sessionId),
      }),
      this.db.query.sessioncards.findMany({
        where: eq(sessioncards.sessionId, sessionId),
      }),
    ]);
    return { pins, cards };
  }

  /** Accumulated total view count once the current session views are folded in. */
  private accumulateViewcount(
    viewcount: number | null | undefined,
    totalViewcount: number | null | undefined,
  ): number | undefined {
    if (viewcount && totalViewcount) {
      return totalViewcount + viewcount;
    }
    return undefined;
  }

  async getAll(): Promise<StudysessionListResponseDto> {
    const sessions = await this.db.query.studysessions.findMany();
    const seshes = [];
    for (const session of sessions) {
      const { pins, cards } = await this.loadSessionChildren(session.id);
      seshes.push({ ...session, cards, pins });
    }
    return { sessions: seshes };
  }

  async getById(
    userId: string,
    sessionId: string,
  ): Promise<StudysessionResponseDto> {
    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.id, sessionId),
        eq(studysessions.userId, userId),
      ),
    });

    if (!session) {
      throw new NotFoundException("Session doesn't exist");
    }

    const { pins, cards } = await this.loadSessionChildren(sessionId);
    return { ...session, pins, cards };
  }

  async updateById(
    userId: string,
    sessionId: string,
    body: UpdateStudysessionDto,
  ): Promise<StudysessionResponseDto> {
    await this.updateStreak(userId);
    const updated = await this.db
      .update(studysessions)
      .set({
        startedAt: body.startedAt,
        durationMin: body.durationMin,
        endedAt: body.endedAt,
        index: body.index,
        accuracy: body.accuracy,
        averageResponseTime: body.averageResponseTime,
        longestFocusStreak: body.longestFocusStreak,
        lastSeen: body.lastSeen,
        lastStudied: body.lastStudied,
      })
      .where(
        and(eq(studysessions.id, sessionId), eq(studysessions.userId, userId)),
      )
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException('No user with this id exists');
    }

    if (body.cards) {
      for (const card of body.cards) {
        const totalviewcount = this.accumulateViewcount(
          card.cardViewcount,
          card.cardTotalViewcount,
        );
        const updateCard = await this.db
          .update(sessioncards)
          .set({
            number: card.number,
            cardViewcount: card.cardViewcount,
            cardTotalViewcount: totalviewcount,
            inQueue: card.inQueue,
            mastered: card.mastered,
            timesRelearned: card.timesRelearned,
            sessionId: card.sessionId,
            ownerId: card.ownerId,
          })
          .where(
            and(eq(sessioncards.id, card.id), eq(sessioncards.ownerId, userId)),
          )
          .returning();

        if (updateCard.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    if (body.pins) {
      for (const pin of body.pins) {
        const updatePin = await this.db
          .update(sessionpins)
          .set({
            number: pin.number,
            inQueue: pin.inQueue,
            pinViewcount: pin.pinViewcount,
            pinTotalViewcount: pin.pinTotalViewcount,
            sessionId: pin.sessionId,
            ownerId: pin.ownerId,
          })
          .where(
            and(eq(sessionpins.id, pin.id), eq(sessionpins.ownerId, userId)),
          )
          .returning();
        if (updatePin.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    return this.getById(userId, sessionId);
  }

  async deleteById(userId: string, sessionId: string): Promise<void> {
    const result = await this.db
      .delete(studysessions)
      .where(
        and(eq(studysessions.id, sessionId), eq(studysessions.userId, userId)),
      )
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No session with this id exists');
    }
  }

  async resetById(
    userId: string,
    sessionId: string,
  ): Promise<StudysessionResponseDto> {
    const pins: SessionPinResponseDTO[] =
      await this.db.query.sessionpins.findMany({
        where: eq(sessionpins.sessionId, sessionId),
      });
    const cards: SessionCardResponseDTO[] =
      await this.db.query.sessioncards.findMany({
        where: eq(sessioncards.sessionId, sessionId),
      });

    if (cards) {
      for (const card of cards) {
        const totalviewcount = this.accumulateViewcount(
          card.cardViewcount,
          card.cardTotalViewcount,
        );
        const updateCard = await this.db
          .update(sessioncards)
          .set({
            cardViewcount: 0,
            cardTotalViewcount: totalviewcount,
            inQueue: false,
            mastered: false,
          })
          .where(
            and(eq(sessioncards.id, card.id), eq(sessioncards.ownerId, userId)),
          )
          .returning();

        if (updateCard.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    if (pins) {
      for (const pin of pins) {
        const updatePin = await this.db
          .update(sessionpins)
          .set({
            inQueue: false,
            pinViewcount: 0,
            pinTotalViewcount: pin.pinTotalViewcount,
          })
          .where(
            and(eq(sessionpins.id, pin.id), eq(sessionpins.ownerId, userId)),
          )
          .returning();
        if (updatePin.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    return this.getById(userId, sessionId);
  }

  async updateStreak(userId: string): Promise<void> {
    const update_streak = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!update_streak) {
      throw new NotFoundException("User doesn't exist");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastUpdate = update_streak.streakLastUpdate;
    const lastUpdateDay = lastUpdate ? new Date(lastUpdate) : null;
    if (lastUpdateDay) lastUpdateDay.setHours(0, 0, 0, 0);

    const isToday = lastUpdateDay?.getTime() === today.getTime();
    const isYesterday = lastUpdateDay?.getTime() === yesterday.getTime();

    if (!isToday) {
      if (isYesterday) {
        await this.db
          .update(users)
          .set({
            streakLastUpdate: new Date(),
            streakCount: update_streak.streakCount
              ? update_streak.streakCount + 1
              : 1,
          })
          .where(eq(users.id, userId));
      } else {
        await this.db
          .update(users)
          .set({
            streakLastUpdate: new Date(),
            streakCount: 0,
            streakStarted: new Date(),
          })
          .where(eq(users.id, userId));
      }
    }
  }
}
