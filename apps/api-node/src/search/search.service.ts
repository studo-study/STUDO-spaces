import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  ClassroomResponse,
  ProfileResponse,
  SetResponse,
  StudoProfileResponse,
} from './search.dto';
import {
  cards,
  classrooms,
  images,
  profiles,
  setlikes,
  studoprofiles,
  studysets,
  visualsets,
} from '../drizzle/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';

// Fresh window: cached data is considered fresh for 5 minutes.
// After that it enters the stale window (served immediately while revalidating in background).
// Total Redis TTL is 10 minutes — after that the key is gone and the next request recomputes.
const CACHE_FRESH_SECONDS = 5 * 60;
const CACHE_TOTAL_SECONDS = 10 * 60;

// Distributed lock settings to prevent cache stampede on a cold miss.
// Only one Node instance acquires the lock and hits the DB; others wait and
// read from cache once it is populated.
const LOCK_TTL_MS = 30_000;
const LOCK_POLL_MS = 50;
const LOCK_MAX_WAIT_MS = 6_000;

interface CacheEntry<T> {
  freshUntil: number; // epoch ms
  data: T;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  // ─── Public helpers ──────────────────────────────────────────────────────────

  async publicSearch(query: string) {
    return this.withCache(`search:public:${this.normalise(query)}`, () =>
      this.compute(query),
    );
  }

  // ─── Cache layer ─────────────────────────────────────────────────────────────

  /**
   * SWR + distributed lock:
   *
   * 1. Fresh hit  → return immediately.
   * 2. Stale hit  → return stale immediately, trigger background refresh
   *                 (protected by a lock so only one recompute fires at a time).
   * 3. Cold miss  → acquire lock, compute, write cache, release lock, return.
   *                 Any concurrent request that loses the race waits up to
   *                 LOCK_MAX_WAIT_MS for the cache to be populated, then falls
   *                 back to a direct DB call only if the wait times out.
   */
  private async withCache<T>(
    cacheKey: string,
    compute: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.readCache<T>(cacheKey);

    if (cached) {
      if (!cached.stale) return cached.data;

      // Stale: serve immediately and revalidate in background.
      void this.backgroundRefresh(cacheKey, compute);
      return cached.data;
    }

    // Cold miss: use a distributed lock to let only one caller hit the DB.
    const lockKey = `${cacheKey}:lock`;
    const acquired = await this.acquireLock(lockKey);

    if (acquired) {
      try {
        const data = await compute();
        await this.writeCache(cacheKey, data);
        return data;
      } finally {
        await this.releaseLock(lockKey);
      }
    }

    // Another instance is already computing — wait for it to populate the cache.
    const waited = await this.pollCache<T>(cacheKey);
    if (waited) return waited;

    // Fallback: lock timed out before cache was ready — compute directly.
    return compute();
  }

  private async backgroundRefresh<T>(
    cacheKey: string,
    compute: () => Promise<T>,
  ): Promise<void> {
    const lockKey = `${cacheKey}:lock`;
    const acquired = await this.acquireLock(lockKey);
    if (!acquired) return; // another instance is already refreshing

    // Fire-and-forget; errors are swallowed so stale data keeps being served.
    void compute()
      .then((data) => this.writeCache(cacheKey, data))
      .catch(() => {
        /* stale data remains valid */
      })
      .finally(() => void this.releaseLock(lockKey));
  }

  // ─── Redis primitives ─────────────────────────────────────────────────────────

  private normalise(query: string): string {
    return query.toLowerCase().trim();
  }

  private async readCache<T>(
    key: string,
  ): Promise<{ data: T; stale: boolean } | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return { data: entry.data, stale: Date.now() > entry.freshUntil };
  }

  private async writeCache<T>(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      freshUntil: Date.now() + CACHE_FRESH_SECONDS * 1000,
      data,
    };
    await this.redis.set(key, JSON.stringify(entry), 'EX', CACHE_TOTAL_SECONDS);
  }

  private async acquireLock(key: string): Promise<boolean> {
    const result = await this.redis.set(key, '1', 'PX', LOCK_TTL_MS, 'NX');
    return result === 'OK';
  }

  private async releaseLock(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /** Poll until the cache key appears or the deadline passes. */
  private async pollCache<T>(cacheKey: string): Promise<T | null> {
    const deadline = Date.now() + LOCK_MAX_WAIT_MS;
    while (Date.now() < deadline) {
      await new Promise<void>((r) => setTimeout(r, LOCK_POLL_MS));
      const cached = await this.readCache<T>(cacheKey);
      if (cached) return cached.data;
    }
    return null;
  }

  // ─── DB computation ───────────────────────────────────────────────────────────

  private async compute(query: string) {
    const term: string = `%${query}%`;
    const [
      studoProfileResult,
      profileResult,
      classroomResult,
      studoysetResult,
      visualsetResult,
    ] = await Promise.all([
      this.db.query.studoprofiles.findMany({
        where: sql`
          similarity(${studoprofiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${studoprofiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${studoprofiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${studoprofiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.profiles.findMany({
        where: sql`
          similarity(${profiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${profiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${profiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${profiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.classrooms.findMany({
        where: sql`similarity(${classrooms.name}, ${query}) > 0.3`,
        orderBy: sql`similarity(${classrooms.name}, ${query}) DESC`,
      }),
      this.db.query.studysets.findMany({
        where: and(
          sql`similarity(${studysets.title}, ${query}) > 0.3`,
          eq(studysets.publicSet, true),
        ),
        orderBy: sql`similarity(${studysets.title}, ${query}) DESC`,
      }),
      this.db.query.visualsets.findMany({
        where: and(
          sql`similarity(${visualsets.title}, ${query}) > 0.3`,
          eq(visualsets.publicSet, true),
        ),
        orderBy: sql`similarity(${visualsets.title}, ${query}) DESC`,
      }),
    ]);

    const ProfileArray: ProfileResponse[] = [];
    const SetArray: SetResponse[] = [];
    const ClassArray: ClassroomResponse[] = [];
    const StudoArray: StudoProfileResponse[] = [];

    // profiles
    profileResult.forEach((p) => {
      ProfileArray.push({
        id: p.userId,
        displayName: p.displayName,
        imgUrl: p.imgUrl,
        type: 'profile',
      });
    });

    // studo-profiles
    studoProfileResult.forEach((s) => {
      StudoArray.push({
        id: s.id,
        displayName: s.displayName,
        imgUrl: s.imgUrl,
        bannerUrl: s.bannerUrl,
      });
    });

    // classrooms — batch owners
    const classroomOwnerIds = [
      ...new Set(classroomResult.map((c) => c.ownerId)),
    ];
    const classroomOwners = classroomOwnerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.userId, classroomOwnerIds),
        })
      : [];

    for (const c of classroomResult) {
      const ownerProfile = classroomOwners.find((p) => p.userId === c.ownerId);
      if (!ownerProfile)
        throw new NotFoundException(`User ${c.ownerId} not found`);

      ClassArray.push({
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        ownerId: c.ownerId,
        type: c.type,
        verified: c.verified,
      });
    }

    // studysets — batch owners, likes, cards
    const studysetIds = studoysetResult.map((ss) => ss.id);
    const studysetOwnerIds = [
      ...new Set(studoysetResult.map((ss) => ss.userId)),
    ];

    const [studysetOwners, allStudysetLikes, allCards] = studysetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.userId, studysetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.setId, studysetIds),
          }),
          this.db.query.cards.findMany({
            where: inArray(cards.setId, studysetIds),
          }),
        ])
      : [[], [], []];

    for (const ss of studoysetResult) {
      const owner = studysetOwners.find((p) => p.userId === ss.userId);
      if (!owner) throw new NotFoundException(`User ${ss.userId} not found`);

      SetArray.push({
        id: ss.id,
        title: ss.title,
        subject: '',
        owner: owner.displayName,
        imgUrl: owner.imgUrl,
        ownerId: ss.userId,
        verified: owner.verified,
        likes: allStudysetLikes.filter((l) => l.setId === ss.id).length,
        items: allCards.filter((c) => c.setId === ss.id).length,
        type: 'studyset',
      });
    }

    // visualsets — batch owners, likes, images
    const visualsetIds = visualsetResult.map((vs) => vs.id);
    const visualsetOwnerIds = [
      ...new Set(visualsetResult.map((vs) => vs.userId)),
    ];

    const [visualsetOwners, allVisualsetLikes, allImages] = visualsetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.userId, visualsetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.setId, visualsetIds),
          }),
          this.db.query.images.findMany({
            where: inArray(images.setId, visualsetIds),
          }),
        ])
      : [[], [], []];

    for (const vs of visualsetResult) {
      const owner = visualsetOwners.find((p) => p.userId === vs.userId);
      if (!owner) throw new NotFoundException(`User ${vs.userId} not found`);

      SetArray.push({
        id: vs.id,
        title: vs.title,
        subject: '',
        owner: owner.displayName,
        imgUrl: owner.imgUrl,
        ownerId: vs.userId,
        verified: owner.verified,
        likes: allVisualsetLikes.filter((l) => l.setId === vs.id).length,
        items: allImages.filter((i) => i.setId === vs.id).length,
        type: 'visualset',
      });
    }

    return this.buildResult(SetArray, ProfileArray, ClassArray, StudoArray);
  }

  private buildResult(
    sets: SetResponse[],
    profiles: ProfileResponse[],
    classrooms: ClassroomResponse[],
    studo: StudoProfileResponse[],
  ) {
    return {
      data: [
        { type: 'set', data: sets },
        { type: 'profile', data: profiles },
        { type: 'classroom', data: classrooms },
        { type: 'studo', data: studo },
      ],
    };
  }
}
