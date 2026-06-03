import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  MyStudysetsResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from './studyset.dto';

import { SwitchFolderDto } from '../folder/folder.dto';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { CardResponseDto, CreateCardDto } from './card.dto';
import { SetLikeResponseDto } from './setlike.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  cards,
  classroomactivities,
  classrooms,
  classroomsets,
  classroomusers,
  folder_sets,
  folders,
  pins,
  sessioncards,
  setlikes,
  studysessions,
  studysets,
  users,
  visualsets,
} from '../drizzle/schema';
import { and, count, eq, inArray, sql } from 'drizzle-orm';

@Injectable()
export class StudysetService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private async invalidateSyncCache(user_id: string) {
    await this.redis.del(`sync:${user_id}`);
  }

  async create(
    user_id: string,
    data: CreateStudysetDto,
  ): Promise<StudysetResponseDto> {
    const date = new Date();
    const setId = uuidv4();
    const name = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });
    if (!name) {
      throw new NotFoundException('no user with this id exists');
    }

    const set = {
      id: setId,
      title: data.title,
      course: data.course,
      global_term_language: data.global_term_language,
      global_definition_language: data.global_definition_language,
      created_at: date.toISOString(),
      last_updated: '',
      public_set: false,
      user_id: user_id,
      displayName: name.displayName,
      img_url: name.img_url,
      studoset: false,
    };

    //sessie creeeren
    const session = {
      id: uuidv4(),
      started_at: date.toISOString(),
      duration_min: 0,
      second_last_login: 'unknown',
      last_login: 'unknown',
      ended_at: 'unknown',
      index: 0,
      accuracy: 100,
      average_response_time: 0,
      longest_focus_streak: 0,
      device_type: 'unknown',
      last_seen: date.toISOString(),
      last_studied: date.toISOString(),
      user_id: user_id,
      set_id: setId,
      set_type: 'studyset',
    };

    //kaarten creeeren
    const CARDS: CardResponseDto[] = [];
    data.cardlist.forEach((c: CreateCardDto) => {
      const card = {
        id: uuidv6(),
        term: c.term,
        definition: c.definition,
        image: c.image ?? null,
        number: c.number,
        created_at: date.toISOString(),
        updated_at: '',
        card_viewcount: 0,
        card_total_viewcount: 0,
        inQueue: false,
        mastered: false,
        times_relearned: 0,
        set_id: setId,
        owner_id: user_id,
        term_content_type: c.term_content_type ?? 'text',
        code_language: c.code_language ?? 'typescript',
      };
      CARDS.push(card);
    });

    await this.db.insert(studysets).values(set);
    await this.db.insert(studysessions).values(session);

    if (data.folder_id) {
      await this.db.insert(folder_sets).values({
        id: uuidv6(),
        user_id: user_id,
        set_id: setId,
        set_type: 'studyset',
        folder_id: data.folder_id,
      });
    }
    await this.db
      .update(users)
      .set({
        totalSets: sql`${users.totalSets}
        + 1`,
      })
      .where(eq(users.id, user_id));
    if (CARDS.length > 0) {
      await this.db.insert(cards).values(CARDS);
    }
    await this.invalidateSyncCache(user_id);
    return { ...set, folder_id: data.folder_id ?? null };
  }

  async createCard(
    user_id: string,
    set_id: string,
    data: CreateCardDto,
  ): Promise<CardResponseDto> {
    const date = new Date();

    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });
    if (!set) throw new NotFoundException('Studyset not found');
    if (set.user_id !== user_id)
      throw new ForbiddenException('You do not own this studoset');

    const card = {
      id: uuidv6(),
      term: data.term,
      definition: data.definition,
      image: data.image ?? null,
      number: data.number,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
      card_viewcount: 0,
      card_total_viewcount: 0,
      inQueue: false,
      mastered: false,
      times_relearned: 0,
      set_id,
      owner_id: user_id,
      term_content_type: data.term_content_type ?? 'text',
      code_language: data.code_language ?? 'typescript',
    };

    await this.db.insert(cards).values(card);

    return {
      id: card.id,
      term: card.term,
      definition: card.definition,
      number: card.number,
      created_at: card.created_at,
      updated_at: card.updated_at,
      set_id: card.set_id,
      owner_id: card.owner_id,
      term_content_type: card.term_content_type,
      code_language: card.code_language,
    };
  }

  async getAll(): Promise<StudysetListResponseDto> {
    return { sets: await this.db.query.studysets.findMany() };
  }

  async getAllByUser(user_id: string): Promise<MyStudysetsResponseDto> {
    const ownSets = await this.db.query.studysets.findMany({
      where: eq(studysets.user_id, user_id),
    });

    const allSessions = await this.db.query.studysessions.findMany({
      where: and(
        eq(studysessions.user_id, user_id),
        eq(studysessions.set_type, 'studyset'),
      ),
    });

    const sessionSetIds = [...new Set(allSessions.map((s) => s.set_id))].filter(
      (id) => !ownSets.some((s) => s.id === id),
    );

    let studiedSets: StudysetResponseDto[] = [];
    if (sessionSetIds.length > 0) {
      studiedSets = await this.db.query.studysets.findMany({
        where: inArray(studysets.id, sessionSetIds),
      });
    }

    const allSets = [...ownSets, ...studiedSets];
    const allSetIds = allSets.map((s) => s.id);

    const cardCounts =
      allSetIds.length > 0
        ? await this.db
            .select({ set_id: cards.set_id, count: count() })
            .from(cards)
            .where(inArray(cards.set_id, allSetIds))
            .groupBy(cards.set_id)
        : [];

    const folderEntries =
      allSetIds.length > 0
        ? await this.db.query.folder_sets.findMany({
            where: and(
              eq(folder_sets.user_id, user_id),
              eq(folder_sets.set_type, 'studyset'),
              inArray(folder_sets.set_id, allSetIds),
            ),
          })
        : [];

    const userSessionCards = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.owner_id, user_id),
    });

    const sets = allSets.map((set) => ({
      ...set,
      card_count: cardCounts.find((c) => c.set_id === set.id)?.count ?? 0,
      last_studied:
        allSessions.find((s) => s.set_id === set.id)?.last_studied ?? null,
      progress: allSessions.find((s) => s.set_id === set.id)?.accuracy ?? 0,
      folder_id:
        folderEntries.find((f) => f.set_id === set.id)?.folder_id ?? null,
    }));

    // --- Visualsets ---
    const ownVisualsets = await this.db.query.visualsets.findMany({
      where: eq(visualsets.user_id, user_id),
    });

    const allVSSessions = await this.db.query.studysessions.findMany({
      where: and(
        eq(studysessions.user_id, user_id),
        eq(studysessions.set_type, 'visualset'),
      ),
    });

    const vsSessionSetIds = [
      ...new Set(allVSSessions.map((s) => s.set_id)),
    ].filter((id) => !ownVisualsets.some((vs) => vs.id === id));

    let studiedVisualsets: (typeof ownVisualsets)[number][] = [];
    if (vsSessionSetIds.length > 0) {
      studiedVisualsets = await this.db.query.visualsets.findMany({
        where: inArray(visualsets.id, vsSessionSetIds),
      });
    }

    const allVisualsets = [...ownVisualsets, ...studiedVisualsets];
    const allVSIds = allVisualsets.map((vs) => vs.id);

    const pinCounts =
      allVSIds.length > 0
        ? await this.db
            .select({ set_id: pins.set_id, count: count() })
            .from(pins)
            .where(inArray(pins.set_id, allVSIds))
            .groupBy(pins.set_id)
        : [];

    const vsFolderEntries =
      allVSIds.length > 0
        ? await this.db.query.folder_sets.findMany({
            where: and(
              eq(folder_sets.user_id, user_id),
              eq(folder_sets.set_type, 'visualset'),
              inArray(folder_sets.set_id, allVSIds),
            ),
          })
        : [];

    const visualsetsMapped = allVisualsets.map((vs) => ({
      ...vs,
      pin_count: pinCounts.find((p) => p.set_id === vs.id)?.count ?? 0,
      last_studied:
        allVSSessions.find((s) => s.set_id === vs.id)?.last_studied ?? null,
      progress: allVSSessions.find((s) => s.set_id === vs.id)?.accuracy ?? 0,
      folder_id:
        vsFolderEntries.find((f) => f.set_id === vs.id)?.folder_id ?? null,
    }));

    const stats = {
      totalsets: sets.length + visualsetsMapped.length,
      timeLearned: [...allSessions, ...allVSSessions].reduce(
        (sum, s) => sum + s.duration_min,
        0,
      ),
      totalCards: userSessionCards.length,
      cardsLearned: userSessionCards.filter((c) => c.card_viewcount >= 2)
        .length,
    };

    return { sets, visualsets: visualsetsMapped, stats };
  }

  async getById(user_id: string, set_id: string): Promise<fullSetResponseDto> {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('No studoset with this id exists');
    }

    // Get user's classrooms
    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.user_id, user_id),
    });

    const classes = [];
    for (const u of classusers) {
      const classroom = await this.db.query.classrooms.findFirst({
        where: eq(classrooms.id, u.classroom_id),
      });
      if (classroom) {
        classes.push(classroom);
      }
    }

    //sets zoeken
    const setclasses = [];
    for (const c of classes) {
      const class_set = await this.db.query.classroomsets.findFirst({
        where: and(
          eq(classroomsets.set_id, set_id),
          eq(classroomsets.classroom_id, c.id),
        ),
      });
      if (class_set) {
        setclasses.push(c);
      }
    }

    // Get user's folders
    const foldrs = await this.db.query.folders.findMany({
      where: eq(folders.owner_id, user_id),
    });

    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.set_id, set_id),
        eq(studysessions.user_id, user_id),
      ),
    });

    let sesh = null;
    if (!session) {
      sesh = await this.createSession(user_id, set_id);
    } else {
      sesh = await this.getBySetId(user_id, set_id);
      if (sesh.cards && sesh.cards.length === 0) {
        await this.db
          .delete(studysessions)
          .where(eq(studysessions.id, sesh.id));
        sesh = await this.createSession(user_id, set_id);
      }
    }

    // Get cards
    const kaarten = await this.db.query.cards.findMany({
      where: eq(cards.set_id, set_id),
    });

    // Get likes
    const likes = await this.db.query.setlikes.findMany({
      where: eq(setlikes.set_id, set_id),
    });

    // Get folder_id for this user/set combination
    const folderEntry = await this.db.query.folder_sets.findFirst({
      where: and(
        eq(folder_sets.user_id, user_id),
        eq(folder_sets.set_id, set_id),
        eq(folder_sets.set_type, 'studyset'),
      ),
    });

    return {
      ...set,
      folder_id: folderEntry?.folder_id ?? null,
      cards: kaarten.sort((a, b) => a.number - b.number) as CardResponseDto[],
      likes: likes,
      session: sesh,
      folders: foldrs,
      classrooms: setclasses,
    };
  }

  async getBySetId(
    user_id: string,
    set_id: string,
  ): Promise<StudysessionResponseDto> {
    let session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.set_id, set_id),
        eq(studysessions.user_id, user_id),
      ),
    });

    if (!session) {
      session = await this.createSession(user_id, set_id);
    }

    const seshcards = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.session_id, session.id),
    });

    return {
      ...session,
      cards: seshcards.sort((a, b) => a.number - b.number),
      pins: null,
    };
  }

  async updateById(
    user_id: string,
    set_id: string,
    body: UpdateStudysetDto,
  ): Promise<StudysetResponseDto> {
    const date = new Date();
    const isoNow = date.toISOString();

    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });
    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    if (set.user_id !== user_id) {
      throw new ForbiddenException('You do not own this studoset');
    }

    const updated = await this.db
      .update(studysets)
      .set({
        title: body.title,
        course: body.course,
        global_term_language: body.global_term_language,
        global_definition_language: body.global_definition_language,
        last_updated: isoNow,
        public_set: body.public_set,
      })
      .where(eq(studysets.id, set_id));

    if (!updated) {
      throw new NotFoundException('Studyset not found');
    }

    if (body.cardlist && body.cardlist.length > 0) {
      await this.db.delete(cards).where(eq(cards.set_id, set_id));

      await this.db.insert(cards).values(
        body.cardlist.map((card) => ({
          id: uuidv6(),
          term: card.term,
          definition: card.definition,
          image: card.image ?? null,
          number: card.number,
          created_at: isoNow,
          updated_at: isoNow,
          card_viewcount: 0,
          card_total_viewcount: 0,
          inQueue: false,
          mastered: false,
          times_relearned: 0,
          set_id,
          owner_id: user_id,
          term_content_type: card.term_content_type ?? 'text',
          code_language: card.code_language ?? 'typescript',
        })),
      );
    } else if (body.cards && body.cards.length > 0) {
      await Promise.all(
        body.cards.map(async (card) => {
          if (!card.id) {
            throw new BadRequestException('Card does niet exist');
          }

          const existingCard = await this.db
            .select()
            .from(cards)
            .where(eq(cards.id, card.id))
            .limit(1)
            .then((rows) => rows[0]);

          if (!existingCard) {
            throw new NotFoundException(`Card not found`);
          }

          await this.db
            .update(cards)
            .set({
              number: card.number,
              term: card.term,
              definition: card.definition,
              updated_at: isoNow,
              ...(card.term_content_type !== undefined && {
                term_content_type: card.term_content_type,
              }),
              ...(card.code_language !== undefined && {
                code_language: card.code_language,
              }),
            })
            .where(eq(cards.id, card.id));
        }),
      );
    }

    return this.getById(user_id, set_id);
  }

  async deleteById(user_id: string, set_id: string): Promise<void> {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    if (set.user_id !== user_id) {
      await this.db
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.set_id, set_id),
            eq(studysessions.user_id, user_id),
            eq(studysessions.set_type, 'studyset'),
          ),
        );
      return;
    }

    await this.db.transaction(async (tx) => {
      await tx
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.set_id, set_id),
            eq(studysessions.set_type, 'studyset'),
          ),
        );

      await tx
        .delete(setlikes)
        .where(
          and(eq(setlikes.set_id, set_id), eq(setlikes.set_type, 'studyset')),
        );

      await tx
        .delete(classroomsets)
        .where(
          and(
            eq(classroomsets.set_id, set_id),
            eq(classroomsets.set_type, 'studyset'),
          ),
        );

      await tx
        .delete(classroomactivities)
        .where(
          and(
            eq(classroomactivities.set_id, set_id),
            eq(classroomactivities.set_type, 'studyset'),
          ),
        );

      const result = await tx
        .delete(studysets)
        .where(eq(studysets.id, set_id))
        .returning();

      if (result.length === 0) {
        throw new NotFoundException('Failed to delete studoset');
      }
    });
    await this.invalidateSyncCache(user_id);
  }

  async switchFolder(
    user_id: string,
    dto: SwitchFolderDto,
  ): Promise<fullSetResponseDto> {
    const checkset = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, dto.set_id),
    });
    if (!checkset) {
      throw new NotFoundException('Studyset not found');
    }

    if (checkset.user_id !== user_id) {
      throw new ForbiddenException('You do not own this studoset');
    }

    const existing = await this.db.query.folder_sets.findFirst({
      where: and(
        eq(folder_sets.user_id, user_id),
        eq(folder_sets.set_id, dto.set_id),
        eq(folder_sets.set_type, 'studyset'),
      ),
    });

    if (existing) {
      await this.db
        .update(folder_sets)
        .set({ folder_id: dto.destinationFolder_id })
        .where(eq(folder_sets.id, existing.id));
    } else {
      await this.db.insert(folder_sets).values({
        id: uuidv6(),
        user_id: user_id,
        set_id: dto.set_id,
        set_type: 'studyset',
        folder_id: dto.destinationFolder_id,
      });
    }

    return this.getById(user_id, dto.set_id);
  }

  async saveToFolder(
    user_id: string,
    set_id: string,
    folder_id: string,
  ): Promise<void> {
    const existing = await this.db.query.folder_sets.findFirst({
      where: and(
        eq(folder_sets.user_id, user_id),
        eq(folder_sets.set_id, set_id),
        eq(folder_sets.set_type, 'studyset'),
      ),
    });

    if (existing) {
      await this.db
        .update(folder_sets)
        .set({ folder_id })
        .where(eq(folder_sets.id, existing.id));
    } else {
      await this.db.insert(folder_sets).values({
        id: uuidv6(),
        user_id,
        set_id,
        set_type: 'studyset',
        folder_id,
      });
    }
  }

  async removeFromFolder(user_id: string, set_id: string): Promise<void> {
    await this.db
      .delete(folder_sets)
      .where(
        and(
          eq(folder_sets.user_id, user_id),
          eq(folder_sets.set_id, set_id),
          eq(folder_sets.set_type, 'studyset'),
        ),
      );
  }

  async likeSet(user_id: string, set_id: string): Promise<SetLikeResponseDto> {
    const date = new Date();
    const like = {
      id: uuidv4(),
      set_id: set_id,
      set_type: 'studyset',
      user_id: user_id,
      created_at: date.toISOString(),
    };

    await this.db.insert(setlikes).values(like);

    return like;
  }

  async removeLike(user_id: string, set_id: string): Promise<void> {
    const result = await this.db
      .delete(setlikes)
      .where(and(eq(setlikes.set_id, set_id), eq(setlikes.user_id, user_id)))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No like with this id exists');
    }
  }

  async getAllLikes(set_id: string): Promise<SetLikeResponseDto[]> {
    return await this.db.query.setlikes.findMany({
      where: eq(setlikes.set_id, set_id),
    });
  }

  async createSession(
    user_id: string,
    set_id: string,
  ): Promise<StudysessionResponseDto> {
    // Zoek de studoset op
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    const date = new Date();
    const ssid = uuidv4();

    const session = {
      id: ssid,
      started_at: date.toISOString(),
      duration_min: 0,
      second_last_login: 'unknown',
      last_login: 'unknown',
      ended_at: 'unknown',
      index: 0,
      accuracy: 100,
      average_response_time: 0,
      longest_focus_streak: 0,
      device_type: 'unknown',
      last_seen: date.toISOString(),
      last_studied: date.toISOString(),
      user_id,
      set_id,
      set_type: 'studyset',
    };

    await this.db.insert(studysessions).values(session);

    const kaartjes = await this.db.query.cards.findMany({
      where: eq(cards.set_id, set_id),
    });

    const seshcards = kaartjes.map((kaart) => ({
      id: uuidv4(),
      number: kaart.number,
      card_viewcount: 0,
      card_total_viewcount: 0,
      inQueue: false,
      mastered: false,
      times_relearned: 0,
      card_id: kaart.id,
      session_id: ssid,
      owner_id: user_id,
    }));

    if (seshcards.length > 0) {
      await this.db.insert(sessioncards).values(seshcards);
    }

    return { ...session, cards: seshcards, pins: null };
  }
}
