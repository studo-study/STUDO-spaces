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
  folders,
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
      join_date: user.join_date.toISOString(),
      last_login: user.last_login.toISOString(),
      streak_started: user.streak_started?.toISOString() ?? null,
      streak_last_update: user.streak_last_update?.toISOString() ?? null,
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
            gte(users.join_date, startOfThisMonth),
            lt(users.join_date, startOfNextMonth),
          ),
        ),
      this.db
        .select({ totalUsersLastMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.join_date, startOfLastMonth),
            lt(users.join_date, startOfThisMonth),
          ),
        ),
      this.db
        .select({ activeUsersThisMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.last_login, startOfThisMonth),
            lt(users.last_login, startOfNextMonth),
          ),
        ),
      this.db
        .select({ activeUsersLastMonth: count() })
        .from(users)
        .where(
          and(
            gte(users.last_login, startOfLastMonth),
            lt(users.last_login, startOfThisMonth),
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
          img_url: true,
          join_date: true,
          publicRole: true,
          verified: true,
          banned: true,
        },
      }),
      this.db.query.classroomactivities.findMany({
        orderBy: [desc(classroomactivities.last_seen)],
        limit: 10,
      }),
      this.db
        .select({
          id: popular_sets.id,
          rank: popular_sets.rank,
          studyset_id: popular_sets.studyset_id,
          visualset_id: popular_sets.visualset_id,
        })
        .from(popular_sets)
        .orderBy(popular_sets.rank)
        .limit(10),
    ]);

    // Resolve popular set titles — 2 batch queries instead of N+1
    const studysetIds = popularSetsRaw
      .map((r) => r.studyset_id)
      .filter(Boolean) as string[];
    const visualsetIds = popularSetsRaw
      .map((r) => r.visualset_id)
      .filter(Boolean) as string[];

    const [studysetsMap, visualsetsMap] = await Promise.all([
      studysetIds.length > 0
        ? this.db
            .select({
              id: studysets.id,
              title: studysets.title,
              course: studysets.course,
              displayName: studysets.displayName,
              img_url: studysets.img_url,
              user_id: studysets.user_id,
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
              course: visualsets.course,
              displayName: visualsets.displayName,
              img_url: visualsets.img_url,
              user_id: visualsets.user_id,
            })
            .from(visualsets)
            .where(inArray(visualsets.id, visualsetIds))
            .then((rows) => new Map(rows.map((r) => [r.id, r])))
        : Promise.resolve(new Map()),
    ]);

    const popularSets = popularSetsRaw
      .map((row) => {
        if (row.studyset_id) {
          const s = studysetsMap.get(row.studyset_id);
          if (s)
            return {
              id: row.id,
              rank: row.rank,
              type: 'studyset' as const,
              title: s.title,
              course: s.course,
              displayName: s.displayName,
              img_url: s.img_url,
              user_id: s.user_id,
            };
        }
        if (row.visualset_id) {
          const v = visualsetsMap.get(row.visualset_id);
          if (v)
            return {
              id: row.id,
              rank: row.rank,
              type: 'visualset' as const,
              title: v.title,
              course: v.course,
              displayName: v.displayName,
              img_url: v.img_url,
              user_id: v.user_id,
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
        join_date: u.join_date.toISOString(),
      })),
      recentActivity,
      popularSets: popularSets.filter(
        Boolean,
      ) as AdminStatsResponse['popularSets'],
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
      userFolders,
      userClassrooms,
    ] = await Promise.all([
      this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, userId),
      }),
      this.db.query.studoprofiles.findFirst({
        where: eq(studoprofiles.id, userId),
      }),
      this.db.query.studysets.findMany({
        where: eq(studysets.user_id, userId),
        orderBy: [desc(studysets.last_updated)],
        limit: 10,
      }),
      this.db.query.visualsets.findMany({
        where: eq(visualsets.user_id, userId),
        orderBy: [desc(visualsets.last_updated)],
        limit: 10,
      }),
      this.db.query.studysessions.findMany({
        where: eq(studysessions.user_id, userId),
        orderBy: [desc(studysessions.started_at)],
        limit: 10,
      }),
      this.db.query.folders.findMany({
        where: eq(folders.owner_id, userId),
      }),
      this.db
        .select({
          id: classrooms.id,
          name: classrooms.name,
          school: classrooms.school,
          type: classrooms.type,
          verified: classrooms.verified,
          created_at: classrooms.created_at,
          role: classroomusers.role,
          joined_at: classroomusers.joined_at,
        })
        .from(classroomusers)
        .innerJoin(classrooms, eq(classroomusers.classroom_id, classrooms.id))
        .where(eq(classroomusers.user_id, userId)),
    ]);

    let studoprofileWithTracks = null;
    if (studoprofile) {
      const tracks = await this.db.query.studotracks.findMany({
        where: eq(studotracks.studoprofile_id, userId),
      });
      studoprofileWithTracks = { ...studoprofile, tracks };
    }

    const totalTimeLearned = recentSessions.reduce(
      (acc, s) => acc + s.duration_min,
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
      join_date: user.join_date.toISOString(),
      last_login: user.last_login.toISOString(),
      streak_started: user.streak_started?.toISOString() ?? null,
      streak_last_update: user.streak_last_update?.toISOString() ?? null,
      roles: user.roles as string[],
      profile: profile
        ? {
            displayName: profile.displayName,
            img_url: profile.img_url,
            banner_url: profile.banner_url ?? null,
            join_date: profile.join_date.toISOString(),
            streak: profile.streak,
            verified: profile.verified,
            tags: profile.tags,
          }
        : null,
      studoprofile: studoprofileWithTracks
        ? {
            displayName: studoprofileWithTracks.displayName,
            img_url: studoprofileWithTracks.img_url,
            banner_url: studoprofileWithTracks.banner_url,
            tags: studoprofileWithTracks.tags,
            tracks: studoprofileWithTracks.tracks.map((t) => ({
              id: t.id,
              trackName: t.trackName,
              icon_name: t.icon_name,
              grade: t.grade,
            })),
          }
        : null,
      recentStudysets: recentStudysets.map((s) => ({ ...s, card_count: 0 })),
      recentVisualsets: recentVisualsets.map((v) => ({ ...v, pin_count: 0 })),
      recentSessions,
      folders: userFolders,
      classrooms: userClassrooms,
      stats: {
        totalSessions: recentSessions.length,
        totalTimeLearned,
        averageAccuracy: avgAccuracy,
        totalStudysets: recentStudysets.length,
        totalVisualsets: recentVisualsets.length,
        totalFolders: userFolders.length,
        totalClassrooms: userClassrooms.length,
      },
    };
  }
}
