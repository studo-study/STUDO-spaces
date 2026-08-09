import { Inject, Injectable } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { settings } from '../drizzle/schema';
import { SettingsResponse, UpdateSettings } from '@studo/types';
import { REDIS_CLIENT } from '../redis/redis.provider';
import type { Redis } from 'ioredis';

// Settings change rarely but are read on many requests, so we keep them in Redis
// (cache-aside). TTL is a safety net: even if an invalidation is ever missed, the
// cache self-heals after this long.
const SETTINGS_TTL_SECONDS = 60 * 60; // 1 hour

@Injectable()
export class SettingsService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private cacheKey(userId: string) {
    return `settings:${userId}`;
  }

  async getUserSettings(userId: string): Promise<SettingsResponse> {
    // 1. Try the cache first. redis.get returns the stored string, or null on a miss.
    const cached = await this.redis.get(this.cacheKey(userId));
    if (cached) {
      // Redis only stores strings, so we serialized with JSON.stringify on write
      // and parse back here.
      return JSON.parse(cached) as SettingsResponse;
    }

    // 2. Cache miss -> hit the DB (creating a default row the first time).
    const fresh = await this.loadOrCreate(userId);

    // 3. Populate the cache so the next read skips the DB.
    await this.writeCache(userId, fresh);

    return fresh;
  }

  async updateUserSettings(
    userId: string,
    patch: UpdateSettings,
  ): Promise<SettingsResponse> {
    // Make sure a row exists, then apply the partial update.
    await this.loadOrCreate(userId);

    const [updated] = await this.db
      .update(settings)
      .set(patch)
      .where(eq(settings.userId, userId))
      .returning();

    // Write-through: refresh the cache with the new value in the same operation as
    // the DB write. This is the critical step — forget it and reads serve stale
    // settings until the TTL expires. (Alternatively call invalidate(userId) to just
    // delete the key and let the next read repopulate; write-through avoids that
    // extra DB round-trip.)
    await this.writeCache(userId, updated);

    return updated;
  }

  // Explicit cache drop — handy if settings are ever changed somewhere outside this
  // service (admin tools, migrations, etc.). Mirror of UserService.invalidateSyncCache.
  async invalidate(userId: string): Promise<void> {
    await this.redis.del(this.cacheKey(userId));
  }

  private async writeCache(userId: string, value: SettingsResponse) {
    await this.redis.set(
      this.cacheKey(userId),
      JSON.stringify(value),
      'EX',
      SETTINGS_TTL_SECONDS,
    );
  }

  private async loadOrCreate(userId: string): Promise<SettingsResponse> {
    const existing = await this.db.query.settings.findFirst({
      where: eq(settings.userId, userId),
    });
    if (existing) {
      return existing;
    }

    const [created] = await this.db
      .insert(settings)
      .values({ userId })
      .returning();

    return created;
  }
}
