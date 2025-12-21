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
import { cards, sessioncards, sessionpins, studysessions, studysets, users } from '../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { SessionCardResponseDTO } from './sessioncard.dto';
import { SessionPinResponseDTO } from './sessionpin.dto';

@Injectable()
export class StudysessionService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {
  }

  async getAll(): Promise<StudysessionListResponseDto> {
    const sessions = await this.db.query.studysessions.findMany();
    const seshes = [];
    for (const session of sessions) {
      const pins = await this.db.query.sessionpins.findMany({
        where: eq(sessionpins.session_id, session.id),
      });

      const cards = await this.db.query.sessioncards.findMany({
        where: eq(sessioncards.session_id, session.id),
      });
      seshes.push({
        ...session,
        cards: cards,
        pins: pins,
      });
    }
    return { sessions: seshes };
  }

  async getById(
    user_id: string,
    session_id: string,
  ): Promise<StudysessionResponseDto> {
    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.id, session_id),
        eq(studysessions.user_id, user_id),
      ),
    });

    if (!session) {
      throw new NotFoundException('Session doesn\'t exist');
    }

    const pins = await this.db.query.sessionpins.findMany({
      where: eq(sessionpins.session_id, session_id),
    });

    const cards = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.session_id, session_id),
    });

    return { ...session, pins: pins, cards: cards };
  }

  async updateById(
    user_id: string,
    session_id: string,
    body: UpdateStudysessionDto,
  ): Promise<StudysessionResponseDto> {
    await this.updateStreak(user_id);
    const updated = await this.db
      .update(studysessions)
      .set({
        started_at: body.started_at,
        duration_min: body.duration_min,
        ended_at: body.ended_at,
        index: body.index,
        accuracy: body.accuracy,
        average_response_time: body.average_response_time,
        longest_focus_streak: body.longest_focus_streak,
        last_seen: body.last_seen,
        last_studied: body.last_studied,
      })
      .where(
        and(
          eq(studysessions.id, session_id),
          eq(studysessions.user_id, user_id),
        ),
      )
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException('No user with this id exists');
    }

    if (body.cards) {
      for (const card of body.cards) {
        let totalviewcount;
        if (card.card_viewcount && card.card_total_viewcount) {
          totalviewcount = card.card_total_viewcount + card.card_viewcount;
        }
        const updateCard = await this.db
          .update(sessioncards)
          .set({
            number: card.number,
            card_viewcount: card.card_viewcount,
            card_total_viewcount: totalviewcount,
            inQueue: card.inQueue,
            mastered: card.mastered,
            times_relearned: card.times_relearned,
            session_id: card.session_id,
            owner_id: card.owner_id,
          })
          .where(
            and(
              eq(sessioncards.id, card.id),
              eq(sessioncards.owner_id, user_id),
            ),
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
            pin_viewcount: pin.pin_viewcount,
            pin_total_viewcount: pin.pin_total_viewcount,
            session_id: pin.session_id,
            owner_id: pin.owner_id,
          })
          .where(
            and(
              eq(sessioncards.id, pin.id),
              eq(sessioncards.owner_id, user_id),
            ),
          )
          .returning();
        if (updatePin.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    return this.getById(user_id, session_id);
  }

  async deleteById(user_id: string, session_id: string): Promise<void> {
    const result = await this.db
      .delete(studysessions)
      .where(
        and(
          eq(studysessions.id, session_id),
          eq(studysessions.user_id, user_id),
        ),
      )
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No session with this id exists');
    }
  }

  async resetById(user_id: string, session_id: string): Promise<StudysessionResponseDto> {
    // const studysessie = this.getById(user_id, session_id);
    const pins: SessionPinResponseDTO[] = await this.db.query.sessionpins.findMany({ where: eq(sessionpins.session_id, session_id) });
    const cards: SessionCardResponseDTO[] = await this.db.query.sessioncards.findMany({ where: eq(sessioncards.session_id, session_id) });


    if (cards) {
      for (const card of cards) {
        let totalviewcount;
        if (card.card_viewcount && card.card_total_viewcount) {
          totalviewcount = card.card_total_viewcount + card.card_viewcount;
        }
        const updateCard = await this.db
          .update(sessioncards)
          .set({
            card_viewcount: 0,
            card_total_viewcount: totalviewcount,
            inQueue: false,
            mastered: false,
          })
          .where(
            and(
              eq(sessioncards.id, card.id),
              eq(sessioncards.owner_id, user_id),
            ),
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
            pin_viewcount: 0,
            pin_total_viewcount: pin.pin_total_viewcount,
          })
          .where(
            and(
              eq(sessionpins.id, pin.id),
              eq(sessionpins.owner_id, user_id),
            ),
          )
          .returning();
        if (updatePin.length === 0) {
          throw new NotFoundException('No user with this id exists');
        }
      }
    }

    return this.getById(user_id, session_id);
  }


  async updateStreak(user_id: string): Promise<void> {
    const update_streak = await this.db.query.users.findFirst({ where: eq(users.id, user_id) });
    if (!update_streak) {
      throw new NotFoundException('User doesn\'t exist');
    }
    const today = new Date();
    const yesterday = new Date(today); // kopie van vandaag
    yesterday.setDate(today.getDate() - 1);

    if (update_streak.streak_last_update != today.toISOString()) {
      if (update_streak.streak_last_update === yesterday.toISOString()) {
        const updated = {
          streak_last_update: today.toISOString(),
          streak_count: update_streak.streak_count ? update_streak.streak_count + 1 : 1,
        };
        await this.db.update(users).set(updated);
      }
      if (update_streak.streak_last_update != yesterday.toISOString() && update_streak.streak_last_update === today.toISOString()) {
        const updated = {
          streak_last_update: today.toISOString(),
          streak_count: 0,
          streak_started: today.toISOString(),
        };
        await this.db.update(users).set(updated);
      }
    }

  }
}

