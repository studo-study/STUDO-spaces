import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { and, eq, gte, inArray, ne, sql } from 'drizzle-orm';
import {
  cards,
  classroomactivities,
  classrooms,
  classroomusers,
  flowboards,
  flowcourses,
  flowrows,
  folders,
  images,
  sessioncards,
  sessionpins,
  setlikes,
  studysessions,
  studysets,
  users,
  visualsets,
} from '../drizzle/schema';
import { ClassroomService } from '../classroom/classroom.service';
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
  StudysessionResponse,
  StudysetResponse,
  TotalStats,
  UserListResponse,
  UserResponseStats,
  VisualsetResponse,
  FullStudysetResponse,
  ClassroomListResponse,
  ClassroomUserResponse,
  ClassroomResponse,
  FullClassroomResponse,
  UpdateUser,
  HeaderResponse,
  StartPagina,
  ClassActivities,
  Boards,
} from '@studo/types';
import { UserResponseDto, UserResponseStatsDto } from './users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    private readonly configService: ConfigService<ServerConfig>,
  ) {}

  async existsById(user_id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, user_id))
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

  async getById(user_id: string): Promise<UserResponseStats> {
    const User = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!User) {
      throw new NotFoundException('No user with this id exists');
    }

    return {
      ...plainToInstance(UserResponseStatsDto, User, {
        excludeExtraneousValues: true,
      }),
      stats: await this.getTotalStats(user_id),
      lastTen: await this.getLastTen(user_id),
    };
  }

  async getTotalStats(user_id: string): Promise<TotalStats> {
    //hier hoef ik geen controles en errors te werpe want de waarden mogen nul zijn
    //sets ophalen
    const stats = await this.db.query.studysessions.findMany({
      where: eq(studysessions.user_id, user_id),
    });

    //setjes ophalen
    const ss = await this.db.query.studysets.findMany({
      where: eq(studysets.user_id, user_id),
    });

    const vs = await this.db.query.visualsets.findMany({
      where: eq(visualsets.user_id, user_id),
    });

    const sets = [...ss, ...vs];

    //cards ophalen
    const cds = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.owner_id, user_id),
    });

    //result returnen

    return {
      totalsets: sets.length,
      timeLearned: stats.reduce(
        (pv: number, sesh: StudysessionResponse) => pv + sesh.duration_min,
        0,
      ),
      totalCards: cds.length,
      cardsLearned: cds
        .filter((card: SessionCardResponse) => {
          if (!card) {
            throw new Error('card not found');
          }
          return card.owner_id === user_id;
        })
        .reduce((pv: number, card: SessionCardResponse) => {
          if (card.card_viewcount >= 2) {
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

  async getLastTen(user_id: string): Promise<LastStudied[]> {
    // Haal sessions op, gesorteerd op last_studied
    const seshes = await this.db.query.studysessions.findMany({
      where: eq(studysessions.user_id, user_id),
    });

    // Sorteer op last_studied (meest recent eerst)
    const sortedSeshes = seshes
      .filter((s) => s.last_studied)
      .sort(
        (a, b) =>
          new Date(b.last_studied).getTime() -
          new Date(a.last_studied).getTime(),
      )
      .slice(0, 10);

    const last: LastStudied[] = [];

    for (const sesh of sortedSeshes) {
      if (sesh.set_type === 'studyset') {
        const studyset = await this.db.query.studysets.findFirst({
          where: eq(studysets.id, sesh.set_id),
        });

        if (!studyset) continue;

        const seshCards = await this.db.query.sessioncards.findMany({
          where: eq(sessioncards.session_id, sesh.id),
        });

        const setCards = await this.db.query.cards.findMany({
          where: eq(cards.set_id, sesh.set_id),
        });

        last.push({
          set_id: studyset.id,
          last_studied: sesh.last_studied,
          title: studyset.title,
          Course: studyset.course,
          type: sesh.set_type,
          progress: seshCards.reduce(
            (pv: number, card: SessionCardResponse) =>
              pv + (card.card_viewcount || 0),
            0,
          ),
          length: setCards.length,
        });
      }

      if (sesh.set_type === 'visualset') {
        const vs = await this.db.query.visualsets.findFirst({
          where: eq(visualsets.id, sesh.set_id),
        });

        if (!vs) continue;

        const seshPins = await this.db.query.sessionpins.findMany({
          where: eq(sessionpins.session_id, sesh.id),
        });

        const setImages = await this.db.query.images.findMany({
          where: eq(images.set_id, sesh.set_id),
        });

        last.push({
          set_id: vs.id,
          last_studied: sesh.last_studied,
          title: vs.title,
          Course: vs.course,
          type: sesh.set_type,
          progress: seshPins.reduce(
            (pv: number, pin: SessionPinResponse) =>
              pv + (pin.pin_viewcount || 0),
            0,
          ),
          length: setImages.length,
        });
      }
    }

    return last;
  }

  async getAllSetsById(user_id: string): Promise<AllsetsResponse> {
    // Haal alle sessies op
    //er kunnen ook geen sessies zijn
    const sessies: Studysession[] = await this.db.query.studysessions.findMany({
      where: eq(studysessions.user_id, user_id),
    });

    // Gebruik Set om duplicaten te voorkomen
    const ssids = [
      ...new Set(
        sessies
          .filter((sess) => sess.set_type === 'studyset')
          .map((sess) => sess.set_id),
      ),
    ];

    const vsids = [
      ...new Set(
        sessies
          .filter((sess) => sess.set_type === 'visualset')
          .map((sess) => sess.set_id),
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

  async getSetById(
    user_id: string,
    set_id: string,
  ): Promise<FullStudysetResponse> {
    const set = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('No studoset with this id exists');
    }

    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.user_id, user_id),
    });
    const classes = [];
    for (const u of classusers) {
      const set = await this.db.query.classrooms.findFirst({
        where: eq(classrooms.id, u.classroom_id),
      });
      if (set) {
        classes.push(set);
      }
    }

    const foldrs = await this.db.query.folders.findMany({
      where: eq(folders.owner_id, user_id),
    });

    if (!foldrs) {
      throw new NotFoundException('No folders');
    }

    const session = await this.db.query.studysessions.findFirst({
      where: eq(studysessions.set_id, set_id),
    });

    if (!session) {
      throw new NotFoundException("Session doesn't exist");
    }

    const seshcards = await this.db.query.sessioncards.findMany({
      where: eq(sessioncards.session_id, session.id),
    });

    const sesh = { ...session, cards: seshcards, pins: null };
    return {
      ...set,
      cards: await this.db.query.cards.findMany({
        where: eq(cards.set_id, set_id),
      }),
      likes: await this.db.query.setlikes.findMany({
        where: eq(setlikes.set_id, set_id),
      }),

      session: sesh,
      folders: foldrs,
      classrooms: classes,
    };
  }

  async getAllClassroomsByUserId(
    user_id: string,
  ): Promise<ClassroomListResponse> {
    //user kan ook geen classrooms gejoined zijn
    const classroomUsers: ClassroomUserResponse[] =
      await this.db.query.classroomusers.findMany({
        where: eq(classroomusers.user_id, user_id),
      });

    const classIds: string[] = classroomUsers.map(
      (u: ClassroomUserResponse) => u.classroom_id,
    );

    const Clsrms: ClassroomResponse[] = [];

    for (const id of classIds) {
      const clsrm = await this.db.query.classrooms.findFirst({
        where: eq(classrooms.id, id),
      });

      if (clsrm) {
        Clsrms.push(clsrm);
      }
    }
    return {
      classrooms: Clsrms,
    };
  }

  async getClassroomByUserId(
    user_id: string,
    classroom_id: string,
  ): Promise<FullClassroomResponse> {
    const userconfirm = await this.db.query.classroomusers.findFirst({
      where: and(
        eq(classroomusers.user_id, user_id),
        eq(classroomusers.classroom_id, classroom_id),
      ),
    });

    const css = new ClassroomService(this.db);
    const room = await css.getById(classroom_id);
    if (!userconfirm) {
      throw new BadRequestException('User is not a member of this classroom');
    }

    return room;
  }

  async updateById(
    user_id: string,
    body: UpdateUser,
  ): Promise<UserResponseStats> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (body.email) {
      const existingUser = await this.db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      if (existingUser) {
        throw new ConflictException(
          'There is already a user with this email address',
        );
      }
    }

    let passwordhash = null;
    if (body.password) {
      passwordhash = await this.hashPassword(body.password);
    }
    await this.db
      .update(users)
      .set({
        email: body.email ?? user.email,
        passwordHash: passwordhash ?? user.passwordHash,
        displayName: body.displayName ?? user.displayName,
        img_url: body.img_url ?? user.img_url,
        streak_started: body.streak_started
          ? new Date(body.streak_started)
          : user.streak_started,
        streak_count: body.streak_count ?? user.streak_count,
        streak_last_update: body.streak_last_update
          ? new Date(body.streak_last_update)
          : user.streak_last_update,
        last_login: body.last_login
          ? new Date(body.last_login)
          : user.last_login,
        roles: body.role ?? user.roles,
      })
      .where(eq(users.id, user_id));
    return this.getById(user_id);
  }

  async deleteById(user_id: string) {
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!existingUser) {
      throw new NotFoundException('No user with this id exists');
    }

    await this.db.delete(users).where(eq(users.id, user_id));
  }

  //TODO
  uploadProfilePicture(_user_id: string, _body: unknown) {
    throw new Error('not yet implemented');
  }

  async headerInfo(user_id: string): Promise<HeaderResponse> {
    const usr = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!usr) {
      throw new NotFoundException('User not found');
    }
    return {
      displayName: usr.displayName,
      email: usr.email,
      streak_count: usr.streak_count,
      pfp: usr.img_url,
    };
  }

  async startPagina(user_id: string): Promise<StartPagina> {
    return {
      lastTen: await this.getLastTen(user_id),
      courses: await this.getCourses(user_id),
      class: await this.getClassmateActivity(user_id),
      stats: await this.getTotalStats(user_id),
      boards: await this.getBoards(user_id),
    };
  }

  async getCourses(user_id: string): Promise<string[]> {
    const courseSet: Set<string> = new Set();
    const sets = await this.getAllSetsById(user_id);

    if (!sets) {
      return [];
    }

    sets.visualsets.forEach((set: VisualsetResponse) => {
      if (set?.course && set.course.trim() !== '') {
        courseSet.add(set.course);
      }
    });

    sets.studysets.forEach((set: StudysetResponse) => {
      if (set?.course && set.course.trim() !== '') {
        courseSet.add(set.course);
      }
    });

    return Array.from(courseSet);
  }

  async getClassmateActivity(user_id: string): Promise<ClassActivities[]> {
    const userClassrooms = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.user_id, user_id),
    });

    // Bereken datum van 2 dagen geleden
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const userArray: ClassActivities[] = [];
    for (const c of userClassrooms) {
      const activities: ClassActivities[] =
        await this.db.query.classroomactivities.findMany({
          where: and(
            eq(classroomactivities.classroom_id, c.classroom_id),
            ne(classroomactivities.user_id, user_id),
            gte(classroomactivities.last_seen, twoDaysAgo.toISOString()),
          ),
        });

      userArray.push(...activities);
    }

    return userArray;
  }

  async getCourse(
    user_id: string,
    course_id: string,
  ): Promise<AllsetsResponse> {
    //er kunnen ook geen sessies zijn
    const sessies: Studysession[] = await this.db.query.studysessions.findMany({
      where: eq(studysessions.user_id, user_id),
    });

    // Gebruik Set om duplicaten te voorkomen
    const ssids = [
      ...new Set(
        sessies
          .filter((sess) => sess.set_type === 'studyset')
          .map((sess) => sess.set_id),
      ),
    ];

    const vsids = [
      ...new Set(
        sessies
          .filter((sess) => sess.set_type === 'visualset')
          .map((sess) => sess.set_id),
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
      studysets: ss.filter((ss) => ss.course === course_id),
      visualsets: vs.filter((vs) => vs.course === course_id),
    };
  }

  async getBoards(user_id: string): Promise<Boards[]> {
    const owner = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });
    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    const stats = await this.db
      .select({
        board_id: flowboards.id,
        total_length: sql<number>`count(${flowrows.id})`.mapWith(Number),
        done: sql<number>`count(*) filter (where ${flowrows.status} = 'done')`.mapWith(
          Number,
        ),
        in_progress:
          sql<number>`count(*) filter (where ${flowrows.status} = 'doing')`.mapWith(
            Number,
          ),
      })
      .from(flowboards)
      .leftJoin(flowcourses, eq(flowcourses.board_id, flowboards.id))
      .leftJoin(flowrows, eq(flowrows.flowcourse_id, flowcourses.id))
      .where(eq(flowboards.owner_id, user_id))
      .groupBy(flowboards.id);

    const boards = await this.db.query.flowboards.findMany({
      where: eq(flowboards.owner_id, user_id),
    });

    const statsByBoard = new Map(stats.map((s) => [s.board_id, s]));

    return boards.map((board) => {
      const s = statsByBoard.get(board.id);
      return {
        id: board.id,
        owner_id: board.owner_id,
        owner_name: owner.displayName,
        owner_pfp: owner.img_url,
        title: board.title,
        icon: board.icon,
        year: board.year,
        semester: board.semester,
        school: board.school_name,
        school_id: board.school_id,
        total_done: s?.done ?? 0,
        total_in_progress: s?.in_progress ?? 0,
        total_length: s?.total_length ?? 0,
        courses: boards.length,
      };
    });
  }
}
