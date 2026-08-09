import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Redis } from 'ioredis';
import { eq } from 'drizzle-orm';
import { Observable } from 'rxjs';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { users } from '../drizzle/schema';

// How long a user is considered "online" after their last request, and how often
// we allow a DB write for last_online. One request per user per window hits the DB;
// every other request in the window is a no-op (handled entirely in Redis).
const ONLINE_TTL_SECONDS = 60;

/**
 * Global interceptor that records per-user "last online" on every authenticated
 * request, regardless of which controller handles it.
 *
 * Runs after guards, so `req.user` (set by AuthGuard from the JWT) is available.
 * Redis provides both live presence (`online:<id>` key exists => online now) and a
 * throttle: the DB is written at most once per ONLINE_TTL_SECONDS per user.
 *
 * Fully fire-and-forget: it never awaits, blocks, or fails the request.
 */
@Injectable()
export class OnlineTrackerInterceptor implements NestInterceptor {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private onlineKey(userId: string) {
    return `online:${userId}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: { id: string } }>();
    const userId = req.user?.id;

    if (userId) {
      // Don't await — presence tracking must never delay or break the response.
      void this.touch(userId);
    }

    return next.handle();
  }

  private async touch(userId: string): Promise<void> {
    try {
      // NX => only set if the key was absent. When it succeeds, this is the first
      // request from this user in the current window, so we also refresh the DB.
      const isFirstInWindow = await this.redis.set(
        this.onlineKey(userId),
        Date.now().toString(),
        'EX',
        ONLINE_TTL_SECONDS,
        'NX',
      );

      if (isFirstInWindow === 'OK') {
        await this.db
          .update(users)
          .set({ lastOnline: new Date() })
          .where(eq(users.id, userId));
      }
    } catch {
      // Presence is best-effort. Swallow errors so a Redis/DB hiccup can't 500 a
      // request that would otherwise succeed.
    }
  }
}
