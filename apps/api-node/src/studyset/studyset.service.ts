import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  MyStudysetsResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from './studyset.dto';

import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { CardResponseDto, CreateCardDto } from './card.dto';
import { SetLikeResponseDto } from './setlike.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  cards,
  classrooms,
  classroomsets,
  classroomusers,
  pins,
  sessioncards,
  setlikes,
  studysessions,
  studysets,
  suggestion_images,
  suggestion_terms_cards,
  users,
  visualsets,
} from '../drizzle/schema';
import { and, count, eq, gte, inArray, sql } from 'drizzle-orm';
import {
  SetCardImageDto,
  SuggestionImagesResponse,
  TermSuggestionDTO,
} from './image.dto';
import { buildNewSession, deleteSetReferences } from '../lib/set-helpers';

@Injectable()
export class StudysetService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private async invalidateSyncCache(userId: string) {
    await this.redis.del(`sync:${userId}`);
  }

  async create(
    userId: string,
    data: CreateStudysetDto,
  ): Promise<StudysetResponseDto> {
    const date = new Date();
    const name = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!name) {
      throw new NotFoundException('no user with this id exists');
    }

    const setValues = {
      title: data.title,
      globalTermLanguage: data.globalTermLanguage,
      globalDefinitionLanguage: data.globalDefinitionLanguage,
      createdAt: date.toISOString(),
      lastUpdated: '',
      publicSet: true,
      userId: userId,
      displayName: name.displayName,
      imgUrl: name.imgUrl,
      studoset: false,
    };

    const [set] = await this.db.insert(studysets).values(setValues).returning();
    const setId = set.id;

    // sessie creeeren
    const session = buildNewSession({
      userId,
      setId,
      setType: 'studyset',
      now: date,
    });

    //kaarten creeeren
    const CARDS: (typeof cards.$inferInsert)[] = data.cardlist.map(
      (c: CreateCardDto) => ({
        term: c.term,
        definition: c.definition,
        suggestionImageId: c.suggestionImageId ?? null,
        number: c.number,
        createdAt: date.toISOString(),
        updatedAt: '',
        setId: setId,
        ownerId: userId,
        termContentType: c.termContentType ?? 'text',
        codeLanguage: c.codeLanguage ?? 'typescript',
      }),
    );

    await this.db.insert(studysessions).values(session);

    await this.db
      .update(users)
      .set({
        totalSets: sql`${users.totalSets}
        + 1`,
      })
      .where(eq(users.id, userId));
    if (CARDS.length > 0) {
      await this.db.insert(cards).values(CARDS);
    }
    await this.invalidateSyncCache(userId);
    return set;
  }

  async createCard(
    userId: string,
    setId: string,
    data: CreateCardDto,
  ): Promise<CardResponseDto> {
    const date = new Date();

    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });
    if (!set) throw new NotFoundException('Studyset not found');
    if (set.userId !== userId)
      throw new ForbiddenException('You do not own this studoset');

    const [card] = await this.db
      .insert(cards)
      .values({
        term: data.term,
        definition: data.definition,
        suggestionImageId: data.suggestionImageId ?? null,
        number: data.number,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        setId,
        ownerId: userId,
        termContentType: data.termContentType ?? 'text',
        codeLanguage: data.codeLanguage ?? 'typescript',
      })
      .returning();

    return {
      id: card.id,
      term: card.term,
      definition: card.definition,
      number: card.number,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      setId: card.setId,
      ownerId: card.ownerId,
      termContentType: card.termContentType as 'text' | 'latex' | 'code',
      codeLanguage: card.codeLanguage,
    };
  }

  async getPublicById(
    setId: string,
  ): Promise<Omit<fullSetResponseDto, 'session' | 'classrooms'>> {
    const set = await this.db.query.studysets.findFirst({
      where: and(eq(studysets.id, setId), eq(studysets.publicSet, true)),
    });

    if (!set) {
      throw new NotFoundException('No public studoset with this id exists');
    }

    const kaarten = await this.db.query.cards.findMany({
      where: eq(cards.setId, setId),
      with: { suggestionImage: true },
    });

    const likes = await this.db.query.setlikes.findMany({
      where: eq(setlikes.setId, setId),
    });

    return {
      ...set,
      cards: kaarten
        .sort((a, b) => a.number - b.number)
        .map(({ suggestionImage, ...card }) => ({
          ...card,
          suggestionImage: suggestionImage ?? null,
        })) as unknown as CardResponseDto[],
      likes,
    };
  }

  async getAll(): Promise<StudysetListResponseDto> {
    return { sets: await this.db.query.studysets.findMany() };
  }

  async getAllByUser(userId: string): Promise<MyStudysetsResponseDto> {
    const ownSets = await this.db.query.studysets.findMany({
      where: eq(studysets.userId, userId),
    });

    const allSessions = await this.db.query.studysessions.findMany({
      where: and(
        eq(studysessions.userId, userId),
        eq(studysessions.setType, 'studyset'),
      ),
    });

    const sessionSetIds = [...new Set(allSessions.map((s) => s.setId))].filter(
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
            .select({ setId: cards.setId, count: count() })
            .from(cards)
            .where(inArray(cards.setId, allSetIds))
            .groupBy(cards.setId)
        : [];

    const [totalCardsResult, learnedCardsResult] = await Promise.all([
      this.db
        .select({ count: count() })
        .from(sessioncards)
        .where(eq(sessioncards.ownerId, userId)),
      this.db
        .select({ count: count() })
        .from(sessioncards)
        .where(
          and(
            eq(sessioncards.ownerId, userId),
            gte(sessioncards.cardViewcount, 2),
          ),
        ),
    ]);

    const sets = allSets.map((set) => ({
      ...set,
      cardCount: cardCounts.find((c) => c.setId === set.id)?.count ?? 0,
      lastStudied:
        allSessions.find((s) => s.setId === set.id)?.lastStudied ?? null,
      progress: allSessions.find((s) => s.setId === set.id)?.accuracy ?? 0,
    }));

    // --- Visualsets ---
    const ownVisualsets = await this.db.query.visualsets.findMany({
      where: eq(visualsets.userId, userId),
    });

    const allVSSessions = await this.db.query.studysessions.findMany({
      where: and(
        eq(studysessions.userId, userId),
        eq(studysessions.setType, 'visualset'),
      ),
    });

    const vsSessionSetIds = [
      ...new Set(allVSSessions.map((s) => s.setId)),
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
            .select({ setId: pins.setId, count: count() })
            .from(pins)
            .where(inArray(pins.setId, allVSIds))
            .groupBy(pins.setId)
        : [];

    const visualsetsMapped = allVisualsets.map((vs) => ({
      ...vs,
      pinCount: pinCounts.find((p) => p.setId === vs.id)?.count ?? 0,
      lastStudied:
        allVSSessions.find((s) => s.setId === vs.id)?.lastStudied ?? null,
      progress: allVSSessions.find((s) => s.setId === vs.id)?.accuracy ?? 0,
    }));

    const stats = {
      totalsets: sets.length + visualsetsMapped.length,
      timeLearned: [...allSessions, ...allVSSessions].reduce(
        (sum, s) => sum + s.durationMin,
        0,
      ),
      totalCards: totalCardsResult[0]?.count ?? 0,
      cardsLearned: learnedCardsResult[0]?.count ?? 0,
    };

    return { sets, visualsets: visualsetsMapped, stats };
  }

  async getById(userId: string, setId: string): Promise<fullSetResponseDto> {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('No studoset with this id exists');
    }

    // Get user's classrooms
    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.userId, userId),
    });

    const classroomIds = classusers.map((u) => u.classroomId);

    const [classes, classroomSetsForThisSet] = await Promise.all([
      classroomIds.length > 0
        ? this.db.query.classrooms.findMany({
            where: inArray(classrooms.id, classroomIds),
          })
        : Promise.resolve([] as (typeof classrooms.$inferSelect)[]),
      classroomIds.length > 0
        ? this.db.query.classroomsets.findMany({
            where: and(
              eq(classroomsets.setId, setId),
              inArray(classroomsets.classroomId, classroomIds),
            ),
          })
        : Promise.resolve([] as (typeof classroomsets.$inferSelect)[]),
    ]);

    const classroomIdsWithSet = new Set(
      classroomSetsForThisSet.map((cs) => cs.classroomId),
    );

    const setclasses = classes.filter((c) => classroomIdsWithSet.has(c.id));

    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.setId, setId),
        eq(studysessions.userId, userId),
      ),
    });

    let sesh = null;
    if (!session) {
      sesh = await this.createSession(userId, setId);
    } else {
      sesh = await this.getBySetId(userId, setId);
      if (sesh.cards && sesh.cards.length === 0) {
        await this.db
          .delete(studysessions)
          .where(eq(studysessions.id, sesh.id));
        sesh = await this.createSession(userId, setId);
      }
    }

    // Get cards
    const kaarten = await this.db.query.cards.findMany({
      where: eq(cards.setId, setId),
      with: {
        suggestionImage: true,
      },
    });

    // Get likes
    const likes = await this.db.query.setlikes.findMany({
      where: eq(setlikes.setId, setId),
    });

    return {
      ...set,
      cards: kaarten
        .sort((a, b) => a.number - b.number)
        .map(({ suggestionImage, ...card }) => ({
          ...card,
          suggestionImage: suggestionImage ?? null,
        })) as unknown as CardResponseDto[],
      likes: likes,
      session: sesh,
      classrooms: setclasses,
    };
  }

  async getBySetId(
    userId: string,
    setId: string,
  ): Promise<StudysessionResponseDto> {
    let session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.setId, setId),
        eq(studysessions.userId, userId),
      ),
    });

    if (!session) {
      session = await this.createSession(userId, setId);
    }

    const seshcards = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.sessionId, session.id),
    });

    return {
      ...session,
      cards: seshcards.sort((a, b) => a.number - b.number),
      pins: null,
    };
  }

  async updateById(
    userId: string,
    setId: string,
    body: UpdateStudysetDto,
  ): Promise<StudysetResponseDto> {
    const date = new Date();
    const isoNow = date.toISOString();

    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });
    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    if (set.userId !== userId) {
      throw new ForbiddenException('You do not own this studoset');
    }

    const updated = await this.db
      .update(studysets)
      .set({
        title: body.title,
        globalTermLanguage: body.globalTermLanguage,
        globalDefinitionLanguage: body.globalDefinitionLanguage,
        lastUpdated: isoNow,
        publicSet: body.publicSet,
      })
      .where(eq(studysets.id, setId));

    if (!updated) {
      throw new NotFoundException('Studyset not found');
    }

    if (body.cardlist && body.cardlist.length > 0) {
      await this.db.delete(cards).where(eq(cards.setId, setId));

      await this.db.insert(cards).values(
        body.cardlist.map((card) => ({
          term: card.term,
          definition: card.definition,
          suggestionImageId: card.suggestionImageId ?? null,
          number: card.number,
          createdAt: isoNow,
          updatedAt: isoNow,
          cardViewcount: 0,
          cardTotalViewcount: 0,
          inQueue: false,
          mastered: false,
          timesRelearned: 0,
          setId,
          ownerId: userId,
          termContentType: card.termContentType ?? 'text',
          codeLanguage: card.codeLanguage ?? 'typescript',
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
              updatedAt: isoNow,
              ...(card.termContentType !== undefined && {
                termContentType: card.termContentType,
              }),
              ...(card.codeLanguage !== undefined && {
                codeLanguage: card.codeLanguage,
              }),
            })
            .where(eq(cards.id, card.id));
        }),
      );
    }

    return this.getById(userId, setId);
  }

  async deleteById(userId: string, setId: string): Promise<void> {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    if (set.userId !== userId) {
      await this.db
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.setId, setId),
            eq(studysessions.userId, userId),
            eq(studysessions.setType, 'studyset'),
          ),
        );
      return;
    }

    await this.db.transaction(async (tx) => {
      await deleteSetReferences(tx, setId, 'studyset');

      const result = await tx
        .delete(studysets)
        .where(eq(studysets.id, setId))
        .returning();

      if (result.length === 0) {
        throw new NotFoundException('Failed to delete studoset');
      }
    });
    await this.invalidateSyncCache(userId);
  }

  async likeSet(userId: string, setId: string): Promise<SetLikeResponseDto> {
    if (await this.isSetOwner(userId, setId)) {
      throw new ForbiddenException("you can't like your own set");
    }

    const date = new Date();
    const [like] = await this.db
      .insert(setlikes)
      .values({
        setId: setId,
        setType: 'studyset',
        userId: userId,
        createdAt: date.toISOString(),
      })
      .returning();

    return like;
  }

  async removeLike(userId: string, setId: string): Promise<void> {
    const result = await this.db
      .delete(setlikes)
      .where(and(eq(setlikes.setId, setId), eq(setlikes.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No like with this id exists');
    }
  }

  async getAllLikes(setId: string): Promise<SetLikeResponseDto[]> {
    return await this.db.query.setlikes.findMany({
      where: eq(setlikes.setId, setId),
    });
  }

  async createSession(
    userId: string,
    setId: string,
  ): Promise<StudysessionResponseDto> {
    // Zoek de studoset op
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('Studyset not found');
    }

    const [session] = await this.db
      .insert(studysessions)
      .values(buildNewSession({ userId, setId, setType: 'studyset' }))
      .returning();
    const ssid = session.id;

    const kaartjes = await this.db.query.cards.findMany({
      where: eq(cards.setId, setId),
    });

    const cardValues = kaartjes.map((kaart) => ({
      number: kaart.number,
      cardViewcount: 0,
      cardTotalViewcount: 0,
      inQueue: false,
      mastered: false,
      timesRelearned: 0,
      cardId: kaart.id,
      sessionId: ssid,
      ownerId: userId,
    }));

    const seshcards =
      cardValues.length > 0
        ? await this.db.insert(sessioncards).values(cardValues).returning()
        : [];

    return { ...session, cards: seshcards, pins: null };
  }

  async suggestImage(
    term: TermSuggestionDTO,
  ): Promise<SuggestionImagesResponse> {
    const normalized = term.term.trim().toLowerCase();
    const cacheKey = `img-suggest:${normalized}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return { images: JSON.parse(cached) };
    }

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(normalized)}&per_page=4`,
      { headers: { Authorization: process.env.PEXELS_API_KEY ?? '' } },
    );
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Pexels ${res.status}:`, errBody);
      throw new BadRequestException('Failed to fetch images from Pexels');
    }
    const data = await res.json();

    const images = await Promise.all(
      data.photos.map(async (p: any) => {
        const existing = await this.db.query.suggestion_images.findFirst({
          where: eq(suggestion_images.pexelsId, String(p.id)),
        });
        if (existing) return existing;

        const [newImage] = await this.db
          .insert(suggestion_images)
          .values({
            pexelsId: String(p.id),
            displayUrl: p.src.large,
            photographer: p.photographer,
            sourcePageUrl: p.url,
            source: 'pexels',
          })
          .returning();
        return newImage;
      }),
    );

    await this.redis.set(cacheKey, JSON.stringify(images), 'EX', 60 * 60 * 24);

    return { images };
  }

  async setCardImage(
    userId: string,
    cardId: string,
    dto: SetCardImageDto,
  ): Promise<void> {
    const card = await this.db.query.cards.findFirst({
      where: eq(cards.id, cardId),
    });
    if (!card) throw new NotFoundException('Card not found');
    if (card.ownerId !== userId)
      throw new ForbiddenException('You do not own this card');

    const image = await this.db.query.suggestion_images.findFirst({
      where: eq(suggestion_images.id, dto.imageId),
    });
    if (!image) throw new NotFoundException('Suggestion image not found');

    await this.db
      .update(cards)
      .set({ suggestionImageId: dto.imageId })
      .where(eq(cards.id, cardId));

    const existing = await this.db.query.suggestion_terms_cards.findFirst({
      where: and(
        eq(suggestion_terms_cards.cardId, cardId),
        eq(suggestion_terms_cards.imageId, dto.imageId),
      ),
    });

    if (existing) {
      await this.db
        .update(suggestion_terms_cards)
        .set({ selectedCount: existing.selectedCount + 1 })
        .where(
          and(
            eq(suggestion_terms_cards.cardId, cardId),
            eq(suggestion_terms_cards.imageId, dto.imageId),
          ),
        );
    } else {
      await this.db.insert(suggestion_terms_cards).values({
        cardId,
        imageId: dto.imageId,
        selectedCount: 1,
      });
    }
  }

  async isSetOwner(userId: string, setId: string) {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });
    return set?.userId === userId;
  }
}
