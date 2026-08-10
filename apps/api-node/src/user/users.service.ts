import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { and, eq, gte, inArray, ne, sql } from 'drizzle-orm';
import { rethrowAsConflict } from '../lib/unique-violation';
import {
  cards,
  classroomactivities,
  classroomusers,
  images,
  sessioncards,
  sessionpins,
  studysessions,
  studysets,
  users,
  visualsets,
} from '../drizzle/schema';
import { plainToInstance } from 'class-transformer';
import { AuthConfig, ServerConfig } from '../config/configuration';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import {
  AllsetsResponse,
  LastStudied,
  SessionCardResponse,
  SessionPinResponse,
  Studysession,
  StudysetResponse,
  TotalStats,
  UserListResponse,
  UserResponseStats,
  VisualsetResponse,
  UpdateUser,
  StartPagina,
  ClassActivities,
  SyncResponse,
} from '@studo/types';
import { UserResponseDto, UserResponseStatsDto } from './users.dto';

const SYNC_TTL_SECONDS = 60;

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    private readonly configService: ConfigService<ServerConfig>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private syncKey(userId: string) {
    return `sync:${userId}`;
  }

  async invalidateSyncCache(userId: string) {
    await this.redis.del(this.syncKey(userId));
  }

  async existsById(userId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result.length > 0;
  }

  async hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.get<AuthConfig>('auth')!; // 👈 2
    // 👇 3
    return argon2.hash(password, {
      type: argon2.argon2id,
      hashLength: authConfig.hashLength,
      timeCost: authConfig.timeCost,
      memoryCost: authConfig.memoryCost,
    });
  }

  async getAll(): Promise<UserListResponse> {
    const dbUsers = await this.db.query.users.findMany();

    return {
      users: plainToInstance(UserResponseDto, dbUsers, {
        excludeExtraneousValues: true, // Only expose fields with @Expose()
      }),
    };
  }

  async getById(userId: string): Promise<UserResponseStats> {
    const User = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!User) {
      throw new NotFoundException('No user with this id exists');
    }

    return {
      ...plainToInstance(UserResponseStatsDto, User, {
        excludeExtraneousValues: true,
      }),
      stats: await this.getTotalStats(userId),
      lastTen: await this.getLastTen(userId),
    };
  }

  async getTotalStats(userId: string): Promise<TotalStats> {
    //hier hoef ik geen controles en errors te werpe want de waarden mogen nul zijn
    //sets ophalen
    const stats = await this.db.query.studysessions.findMany({
      where: eq(studysessions.userId, userId),
    });

    //setjes ophalen
    const ss = await this.db.query.studysets.findMany({
      where: eq(studysets.userId, userId),
    });

    const vs = await this.db.query.visualsets.findMany({
      where: eq(visualsets.userId, userId),
    });

    const sets = [...ss, ...vs];

    //cards ophalen
    const cds = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.ownerId, userId),
    });

    //result returnen

    return {
      totalsets: sets.length,
      timeLearned: stats.reduce(
        (pv: number, sesh: Studysession) => pv + (sesh?.durationMin ?? 0),
        0,
      ),
      totalCards: cds.length,
      cardsLearned: cds
        .filter((card: SessionCardResponse) => {
          if (!card) {
            throw new Error('card not found');
          }
          return card.ownerId === userId;
        })
        .reduce((pv: number, card: SessionCardResponse) => {
          if (card.cardViewcount >= 2) {
            return (pv += 1);
          } else {
            if (!card) {
              throw new Error('card not found');
            } else {
              return pv;
            }
          }
        }, 0),
    };
  }

  async getLastTen(userId: string): Promise<LastStudied[]> {
    // Haal sessions op, gesorteerd op last_studied
    const seshes = await this.db.query.studysessions.findMany({
      where: eq(studysessions.userId, userId),
    });

    // Sorteer op last_studied (meest recent eerst)
    const sortedSeshes = seshes
      .filter((s) => s.lastStudied)
      .sort(
        (a, b) =>
          new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime(),
      )
      .slice(0, 10);

    const last: LastStudied[] = [];

    for (const sesh of sortedSeshes) {
      if (sesh.setType === 'studyset') {
        const studyset = await this.db.query.studysets.findFirst({
          where: eq(studysets.id, sesh.setId),
        });

        if (!studyset) continue;

        const seshCards = await this.db.query.sessioncards.findMany({
          where: eq(sessioncards.sessionId, sesh.id),
        });

        const setCards = await this.db.query.cards.findMany({
          where: eq(cards.setId, sesh.setId),
        });

        last.push({
          setId: studyset.id,
          lastStudied: sesh.lastStudied,
          title: studyset.title,
          type: sesh.setType,
          progress: seshCards.reduce(
            (pv: number, card: SessionCardResponse) =>
              pv + ((card.cardViewcount > 1 && 1) || 0),
            0,
          ),
          length: setCards.length,
        });
      }

      if (sesh.setType === 'visualset') {
        const vs = await this.db.query.visualsets.findFirst({
          where: eq(visualsets.id, sesh.setId),
        });

        if (!vs) continue;

        const seshPins = await this.db.query.sessionpins.findMany({
          where: eq(sessionpins.sessionId, sesh.id),
        });

        const setImages = await this.db.query.images.findMany({
          where: eq(images.setId, sesh.setId),
        });

        last.push({
          setId: vs.id,
          lastStudied: sesh.lastStudied,
          title: vs.title,
          type: sesh.setType,
          progress: seshPins.reduce(
            (pv: number, pin: SessionPinResponse) =>
              pv + ((pin.pinViewcount > 1 && 1) || 0),
            0,
          ),
          length: setImages.length,
        });
      }
    }

    return last;
  }

  async getAllSetsById(userId: string): Promise<AllsetsResponse> {
    // Haal alle sessies op
    //er kunnen ook geen sessies zijn
    const sessies: Studysession[] = await this.db.query.studysessions.findMany({
      where: eq(studysessions.userId, userId),
    });

    // Gebruik Set om duplicaten te voorkomen
    const ssids = [
      ...new Set(
        sessies
          .filter((sess) => sess.setType === 'studyset')
          .map((sess) => sess.setId),
      ),
    ];

    const vsids = [
      ...new Set(
        sessies
          .filter((sess) => sess.setType === 'visualset')
          .map((sess) => sess.setId),
      ),
    ];

    // Gebruik inArray() om alle sets in één query op te halen
    let ss: StudysetResponse[] = [];
    let vs: VisualsetResponse[] = [];

    if (ssids.length > 0) {
      ss = await this.db.query.studysets.findMany({
        where: inArray(studysets.id, ssids),
      });
    }

    if (vsids.length > 0) {
      vs = await this.db.query.visualsets.findMany({
        where: inArray(visualsets.id, vsids),
      });
    }

    return {
      studysets: ss,
      visualsets: vs,
    };
  }

  async updateById(
    userId: string,
    body: UpdateUser,
  ): Promise<UserResponseStats> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (body.email) {
      // Case-insensitive vergelijken en de eigen rij uitsluiten: een user die
      // zijn (ongewijzigde) email opnieuw opstuurt mag geen conflict krijgen.
      const existingUser = await this.db.query.users.findFirst({
        where: and(
          sql`lower(${users.email}) = lower(${body.email})`,
          ne(users.id, userId),
        ),
      });

      if (existingUser) {
        throw new ConflictException({
          message: 'There is already a user with this email address',
          details: { code: 'EMAIL_TAKEN' },
        });
      }
    }

    if (body.displayName) {
      // Zelfde patroon als email: case-insensitief en de eigen rij uitsluiten.
      const clash = await this.db.query.users.findFirst({
        where: and(
          sql`lower(${users.displayName}) = lower(${body.displayName})`,
          ne(users.id, userId),
        ),
      });

      if (clash) {
        throw new ConflictException({
          message: 'There is already a user with this display name',
          details: { code: 'DISPLAY_NAME_TAKEN' },
        });
      }
    }

    let passwordhash = null;
    if (body.password) {
      passwordhash = await this.hashPassword(body.password);
    }
    await this.db
      .update(users)
      .set({
        email: body.email?.toLowerCase() ?? user.email,
        passwordHash: passwordhash ?? user.passwordHash,
        displayName: body.displayName ?? user.displayName,
        imgUrl: body.imgUrl ?? user.imgUrl,
        streakStarted: body.streakStarted
          ? new Date(body.streakStarted)
          : user.streakStarted,
        streakCount: body.streakCount ?? user.streakCount,
        streakLastUpdate: body.streakLastUpdate
          ? new Date(body.streakLastUpdate)
          : user.streakLastUpdate,
        lastLogin: body.lastLogin ? new Date(body.lastLogin) : user.lastLogin,
        roles: body.role ?? user.roles,
      })
      .where(eq(users.id, userId))
      .catch(rethrowAsConflict);
    return this.getById(userId);
  }

  async deleteById(userId: string) {
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      throw new NotFoundException('No user with this id exists');
    }

    await this.db.delete(users).where(eq(users.id, userId));
  }

  async startPagina(userId: string): Promise<StartPagina> {
    return {
      lastTen: await this.getLastTen(userId),
      class: await this.getClassmateActivity(userId),
      stats: await this.getTotalStats(userId),
    };
  }

  async sync(userId: string): Promise<SyncResponse> {
    const key = this.syncKey(userId);
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as SyncResponse;

    const [allSets, start] = await Promise.all([
      this.getAllSetsById(userId),
      this.startPagina(userId),
    ]);

    const result: SyncResponse = {
      studysets: allSets.studysets,
      visualsets: allSets.visualsets,
      start,
    };

    await this.redis.set(key, JSON.stringify(result), 'EX', SYNC_TTL_SECONDS);
    return result;
  }

  async getClassmateActivity(userId: string): Promise<ClassActivities[]> {
    const userClassrooms = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.userId, userId),
    });
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const userArray: ClassActivities[] = [];
    for (const c of userClassrooms) {
      const activities: ClassActivities[] =
        await this.db.query.classroomactivities.findMany({
          where: and(
            eq(classroomactivities.classroomId, c.classroomId),
            ne(classroomactivities.userId, userId),
            gte(classroomactivities.lastSeen, twoDaysAgo.toISOString()),
          ),
        });

      userArray.push(...activities);
    }

    return userArray;
  }
}
