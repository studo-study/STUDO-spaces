import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  AdminStatsResponse,
  AdminUserDetail,
  UserResponse,
} from '@studo/types';
import { and, count, desc, eq, gte, ilike, inArray, lt, or } from 'drizzle-orm';
import {
  classroomactivities,
  classroomusers,
  classrooms,
  popular_sets,
  profiles,
  studoprofiles,
  studotracks,
  studysessions,
  studysets,
  users,
  visualsets,
} from '../drizzle/schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getByCredential(credential: string): Promise<UserResponse[]> {
    const found = await this.db.query.users.findMany({
      where: or(
        ilike(users.displayName, `%${credential}%`),
        ilike(users.email, `%${credential}%`),
      ),
      limit: 20,
    });

    return found.map((user) => ({
      ...user,
      joinDate: user.joinDate.toISOString(),
      lastLogin: user.lastLogin.toISOString(),
      streakStarted: user.streakStarted?.toISOString() ?? null,
      streakLastUpdate: user.streakLastUpdate?.toISOString() ?? null,
      roles: user.roles as string[],
    }));
  }

  async getStats(): Promise<AdminStatsResponse> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      [{ totalUsers }],
      [{ totalUsersThisMonth }],
      [{ totalUsersLastMonth }],
      [{ activeUsersThisMonth }],
      [{ activeUsersLastMonth }],
      [{ totalStudysets }],
      [{ totalVisualsets }],
      recentUsers,
      recentActivity,
      popularSetsRaw,
    ] = await Promise.all([
      this.db.select({ totalUsers: count() }).from(users),
      this.db
        .select({ totalUsersThisMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.joinDate, startOfThisMonth),
            lt(users.joinDate, startOfNextMonth),
          ),
        ),
      this.db
        .select({ totalUsersLastMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.joinDate, startOfLastMonth),
            lt(users.joinDate, startOfThisMonth),
          ),
        ),
      this.db
        .select({ activeUsersThisMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.lastLogin, startOfThisMonth),
            lt(users.lastLogin, startOfNextMonth),
          ),
        ),
      this.db
        .select({ activeUsersLastMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.lastLogin, startOfLastMonth),
            lt(users.lastLogin, startOfThisMonth),
          ),
        ),
      this.db.select({ totalStudysets: count() }).from(studysets),
      this.db.select({ totalVisualsets: count() }).from(visualsets),
      this.db.query.users.findMany({
        orderBy: [desc(users.joinNumber)],
        limit: 10,
        columns: {
          id: true,
          displayName: true,
          imgUrl: true,
          joinDate: true,
          publicRole: true,
          verified: true,
          banned: true,
        },
      }),
      this.db.query.classroomactivities.findMany({
        orderBy: [desc(classroomactivities.lastSeen)],
        limit: 10,
      }),
      this.db
        .select({
          id: popular_sets.id,
          rank: popular_sets.rank,
          studysetId: popular_sets.studysetId,
          visualsetId: popular_sets.visualsetId,
        })
        .from(popular_sets)
        .orderBy(popular_sets.rank)
        .limit(10),
    ]);

    // Resolve popular set titles — 2 batch queries instead of N+1
    const studysetIds = popularSetsRaw
      .map((r) => r.studysetId)
      .filter(Boolean) as string[];
    const visualsetIds = popularSetsRaw
      .map((r) => r.visualsetId)
      .filter(Boolean) as string[];

    const [studysetsMap, visualsetsMap] = await Promise.all([
      studysetIds.length > 0
        ? this.db
            .select({
              id: studysets.id,
              title: studysets.title,
              displayName: studysets.displayName,
              imgUrl: studysets.imgUrl,
              userId: studysets.userId,
            })
            .from(studysets)
            .where(inArray(studysets.id, studysetIds))
            .then((rows) => new Map(rows.map((r) => [r.id, r])))
        : Promise.resolve(new Map()),
      visualsetIds.length > 0
        ? this.db
            .select({
              id: visualsets.id,
              title: visualsets.title,
              displayName: visualsets.displayName,
              imgUrl: visualsets.imgUrl,
              userId: visualsets.userId,
            })
            .from(visualsets)
            .where(inArray(visualsets.id, visualsetIds))
            .then((rows) => new Map(rows.map((r) => [r.id, r])))
        : Promise.resolve(new Map()),
    ]);

    const popularSets = popularSetsRaw
      .map((row) => {
        if (row.studysetId) {
          const s = studysetsMap.get(row.studysetId);
          if (s)
            return {
              id: row.id,
              rank: row.rank,
              type: 'studyset' as const,
              title: s.title,
              displayName: s.displayName,
              imgUrl: s.imgUrl,
              userId: s.userId,
            };
        }
        if (row.visualsetId) {
          const v = visualsetsMap.get(row.visualsetId);
          if (v)
            return {
              id: row.id,
              rank: row.rank,
              type: 'visualset' as const,
              title: v.title,
              displayName: v.displayName,
              imgUrl: v.imgUrl,
              userId: v.userId,
            };
        }
        return null;
      })
      .filter(Boolean) as AdminStatsResponse['popularSets'];

    return {
      totalUsers,
      totalUsersThisMonth,
      totalUsersLastMonth,
      activeUsersThisMonth,
      activeUsersLastMonth,
      totalStudysets,
      totalVisualsets,
      recentUsers: recentUsers.map((u) => ({
        ...u,
        joinDate: u.joinDate.toISOString(),
      })),
      recentActivity,
      popularSets,
    };
  }

  async getUserDetail(userId: string): Promise<AdminUserDetail> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) throw new NotFoundException('User not found');

    const [
      profile,
      studoprofile,
      recentStudysets,
      recentVisualsets,
      recentSessions,
      userClassrooms,
    ] = await Promise.all([
      this.db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
      }),
      this.db.query.studoprofiles.findFirst({
        where: eq(studoprofiles.id, userId),
      }),
      this.db.query.studysets.findMany({
        where: eq(studysets.userId, userId),
        orderBy: [desc(studysets.lastUpdated)],
        limit: 10,
      }),
      this.db.query.visualsets.findMany({
        where: eq(visualsets.userId, userId),
        orderBy: [desc(visualsets.lastUpdated)],
        limit: 10,
      }),
      this.db.query.studysessions.findMany({
        where: eq(studysessions.userId, userId),
        orderBy: [desc(studysessions.startedAt)],
        limit: 10,
      }),
      this.db
        .select({
          id: classrooms.id,
          name: classrooms.name,
          school: classrooms.school,
          type: classrooms.type,
          verified: classrooms.verified,
          createdAt: classrooms.createdAt,
          role: classroomusers.role,
          joinedAt: classroomusers.joinedAt,
        })
        .from(classroomusers)
        .innerJoin(classrooms, eq(classroomusers.classroomId, classrooms.id))
        .where(eq(classroomusers.userId, userId)),
    ]);

    let studoprofileWithTracks = null;
    if (studoprofile) {
      const tracks = await this.db.query.studotracks.findMany({
        where: eq(studotracks.studoprofileId, userId),
      });
      studoprofileWithTracks = { ...studoprofile, tracks };
    }

    const totalTimeLearned = recentSessions.reduce(
      (acc, s) => acc + s.durationMin,
      0,
    );
    const avgAccuracy =
      recentSessions.length > 0
        ? Math.round(
            recentSessions.reduce((acc, s) => acc + s.accuracy, 0) /
              recentSessions.length,
          )
        : 0;

    return {
      ...user,
      joinDate: user.joinDate.toISOString(),
      lastLogin: user.lastLogin.toISOString(),
      streakStarted: user.streakStarted?.toISOString() ?? null,
      streakLastUpdate: user.streakLastUpdate?.toISOString() ?? null,
      roles: user.roles as string[],
      profile: profile
        ? {
            displayName: profile.displayName,
            imgUrl: profile.imgUrl,
            bannerUrl: profile.bannerUrl ?? null,
            joinDate: profile.joinDate.toISOString(),
            streak: profile.streak,
            verified: profile.verified,
            tags: profile.tags,
          }
        : null,
      studoprofile: studoprofileWithTracks
        ? {
            displayName: studoprofileWithTracks.displayName,
            imgUrl: studoprofileWithTracks.imgUrl,
            bannerUrl: studoprofileWithTracks.bannerUrl,
            tags: studoprofileWithTracks.tags,
            tracks: studoprofileWithTracks.tracks.map((t) => ({
              id: t.id,
              trackName: t.trackName,
              iconName: t.iconName,
              grade: t.grade,
            })),
          }
        : null,
      recentStudysets: recentStudysets.map((s) => ({ ...s, card_count: 0 })),
      recentVisualsets: recentVisualsets.map((v) => ({ ...v, pin_count: 0 })),
      recentSessions,
      classrooms: userClassrooms,
      stats: {
        totalSessions: recentSessions.length,
        totalTimeLearned,
        averageAccuracy: avgAccuracy,
        totalStudysets: recentStudysets.length,
        totalVisualsets: recentVisualsets.length,
        totalClassrooms: userClassrooms.length,
      },
    };
  }
}
