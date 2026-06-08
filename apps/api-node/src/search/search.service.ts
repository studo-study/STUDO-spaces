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

  async search(query: string, _id: string) {
    return this.withCache(`search:auth:${this.normalise(query)}`, () =>
      this.compute(query),
    );
  }

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
          eq(studysets.public_set, true),
        ),
        orderBy: sql`similarity(${studysets.title}, ${query}) DESC`,
      }),
      this.db.query.visualsets.findMany({
        where: and(
          sql`similarity(${visualsets.title}, ${query}) > 0.3`,
          eq(visualsets.public_set, true),
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
        id: p.user_id,
        displayName: p.displayName,
        img_url: p.img_url,
        type: 'profile',
      });
    });

    // studo-profiles
    studoProfileResult.forEach((s) => {
      StudoArray.push({
        id: s.id,
        displayName: s.displayName,
        img_url: s.img_url,
        banner_url: s.banner_url,
      });
    });

    // classrooms — batch owners
    const classroomOwnerIds = [
      ...new Set(classroomResult.map((c) => c.owner_id)),
    ];
    const classroomOwners = classroomOwnerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.user_id, classroomOwnerIds),
        })
      : [];

    for (const c of classroomResult) {
      const ownerProfile = classroomOwners.find(
        (p) => p.user_id === c.owner_id,
      );
      if (!ownerProfile)
        throw new NotFoundException(`User ${c.owner_id} not found`);

      ClassArray.push({
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        owner_id: c.owner_id,
        type: c.type,
        verified: c.verified,
      });
    }

    // studysets — batch owners, likes, cards
    const studysetIds = studoysetResult.map((ss) => ss.id);
    const studysetOwnerIds = [
      ...new Set(studoysetResult.map((ss) => ss.user_id)),
    ];

    const [studysetOwners, allStudysetLikes, allCards] = studysetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, studysetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, studysetIds),
          }),
          this.db.query.cards.findMany({
            where: inArray(cards.set_id, studysetIds),
          }),
        ])
      : [[], [], []];

    for (const ss of studoysetResult) {
      const owner = studysetOwners.find((p) => p.user_id === ss.user_id);
      if (!owner) throw new NotFoundException(`User ${ss.user_id} not found`);

      SetArray.push({
        id: ss.id,
        title: ss.title,
        subject: ss.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: ss.user_id,
        verified: owner.verified,
        likes: allStudysetLikes.filter((l) => l.set_id === ss.id).length,
        items: allCards.filter((c) => c.set_id === ss.id).length,
        type: 'studyset',
      });
    }

    // visualsets — batch owners, likes, images
    const visualsetIds = visualsetResult.map((vs) => vs.id);
    const visualsetOwnerIds = [
      ...new Set(visualsetResult.map((vs) => vs.user_id)),
    ];

    const [visualsetOwners, allVisualsetLikes, allImages] = visualsetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, visualsetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, visualsetIds),
          }),
          this.db.query.images.findMany({
            where: inArray(images.set_id, visualsetIds),
          }),
        ])
      : [[], [], []];

    for (const vs of visualsetResult) {
      const owner = visualsetOwners.find((p) => p.user_id === vs.user_id);
      if (!owner) throw new NotFoundException(`User ${vs.user_id} not found`);

      SetArray.push({
        id: vs.id,
        title: vs.title,
        subject: vs.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: vs.user_id,
        verified: owner.verified,
        likes: allVisualsetLikes.filter((l) => l.set_id === vs.id).length,
        items: allImages.filter((i) => i.set_id === vs.id).length,
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
