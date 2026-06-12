import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
  ClassroomSetDto,
  ClassroomUserDto,
  ClassroomUserResponseDto,
  CreateClassroomActivityDto,
  CreateClassroomDto,
  CreateClassroomSetsDto,
  CreateClassroomUserDto,
  FullClassroomResponseDto,
  FullClassroomSetDto,
  UpdateClassroomDto,
} from './classroom.dto';

import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  classroomactivities,
  classrooms,
  classroomsets,
  classroomusers,
  profiles,
  studysets,
  users,
  visualsets,
} from '../drizzle/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { ClassActivitiesDto } from '../user/users.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async create(
    user_id: string,
    classroom: CreateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    const uid = uuidv4();
    const date = new Date();

    const Class: ClassroomResponseDto = {
      id: uid,
      name: classroom.name,
      owner_id: user_id,
      type: classroom.type,
      created_at: date.toISOString(),
      verified: false,
      school: classroom.school,
    };

    const owner: ClassroomUserResponseDto = {
      user_id: user_id,
      classroom_id: uid,
      role: 'owner',
      joined_at: date.toISOString(),
      position: 0,
    };

    await this.db.insert(classrooms).values(Class);
    await this.db.insert(classroomusers).values(owner);
    return Class;
  }

  async add(
    classroom_id: string,
    set_id: string,
    user_id: string,
  ): Promise<ClassroomSetDto> {
    const studyset = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, set_id),
    });
    const visualset = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, set_id),
    });

    let set;
    let type;
    if (studyset) {
      set = studyset;
      type = 'studyset';
    } else if (visualset) {
      set = visualset;
      type = 'visualset';
    } else {
      throw new NotFoundException(`"studoset·doesn't·exist"`);
    }

    const cset: ClassroomSetDto = {
      set_id: set.id,
      set_type: type,
      classroom_id: classroom_id,
      added_by: user_id,
    };

    await this.db.insert(classroomsets).values(cset);

    return cset;
  }

  async addSets(
    classroom_id: string,
    user_id: string,
    body: CreateClassroomSetsDto,
  ): Promise<ClassroomSetDto[]> {
    const sets: ClassroomSetDto[] = [];
    for (const s of body.sets) {
      const set = await this.add(classroom_id, s, user_id);
      sets.push(set);
    }
    return sets;
  }

  async createActivity(
    user_id: string,
    classroom_id: string,
    activityDto: CreateClassroomActivityDto,
  ): Promise<ClassActivitiesDto> {
    // Classroom check
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, classroom_id),
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom doesn't exist`);
    }

    // Check of user al activity heeft en verwijder die
    const oldActivity = await this.db.query.classroomactivities.findFirst({
      where: and(
        eq(classroomactivities.user_id, user_id),
        eq(classroomactivities.classroom_id, classroom_id),
      ),
    });

    if (oldActivity) {
      await this.db
        .delete(classroomactivities)
        .where(
          and(
            eq(classroomactivities.user_id, user_id),
            eq(classroomactivities.classroom_id, classroom_id),
          ),
        );
    }

    const date = new Date();
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.user_id, user_id),
    });

    if (!user) {
      throw new NotFoundException(`User profile doesn't exist`);
    }

    let set_type: string;
    let set: any;

    const studyset = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, activityDto.set_id),
    });

    if (studyset) {
      set_type = 'studyset';
      set = studyset;
    } else {
      const visualset = await this.db.query.visualsets.findFirst({
        where: eq(visualsets.id, activityDto.set_id),
      });

      if (!visualset) {
        throw new NotFoundException(`Set doesn't exist`);
      }

      set_type = 'visualset';
      set = visualset;
    }

    // Nieuwe activiteit genereren
    const newActivity: ClassActivitiesDto = {
      id: uuidv4(),
      classroom_id: classroom_id,
      user_id: user_id,
      displayName: user.displayName,
      img_url: user.img_url,
      set_id: activityDto.set_id,
      set_type: set_type,
      title: set.title,
      last_seen: date.toISOString(),
    };

    // Inserten en returnen
    await this.db.insert(classroomactivities).values(newActivity);
    return newActivity;
  }
  async remove(
    classroom_id: string,
    set: string,
    user_id: string,
  ): Promise<void> {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, classroom_id),
    });

    if (!classroom) {
      throw new NotFoundException('No classroom with this id exists');
    }

    if (classroom.owner_id !== user_id) {
      throw new ForbiddenException('You do not own this classroom');
    }

    const result = await this.db
      .delete(classroomsets)
      .where(
        and(
          eq(classroomsets.set_id, set),
          eq(classroomsets.classroom_id, classroom_id),
        ),
      )
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No classroomset with this id exists');
    }
  }

  async join(
    user_id: string,
    user: CreateClassroomUserDto,
  ): Promise<ClassroomUserResponseDto> {
    const date = new Date();
    const u = {
      user_id: user_id,
      classroom_id: user.classroom_id,
      role: user.role,
      joined_at: date.toISOString(),
      position: 0,
    };

    await this.db.insert(classroomusers).values(u);
    return u;
  }

  async leave(user_id: string, classroom_id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const user = await tx.query.classroomusers.findFirst({
        where: and(
          eq(classroomusers.classroom_id, classroom_id),
          eq(classroomusers.user_id, user_id),
        ),
      });

      if (!user) {
        throw new NotFoundException('No user with this id exists');
      }

      if (user.role === 'owner') {
        const members = await tx.query.classroomusers.findMany({
          where: eq(classroomusers.classroom_id, classroom_id),
        });

        if (members.length < 2) {
          throw new BadRequestException(
            'Cannot leave: you are the only member',
          );
        }

        const nextOwner = members
          .filter((m) => m.user_id !== user_id)
          .sort(
            (a, b) =>
              new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime(),
          )[0];

        await tx
          .update(classroomusers)
          .set({ role: 'owner' })
          .where(
            and(
              eq(classroomusers.classroom_id, classroom_id),
              eq(classroomusers.user_id, nextOwner.user_id),
            ),
          );

        await tx
          .update(classrooms)
          .set({ owner_id: nextOwner.user_id })
          .where(eq(classrooms.id, classroom_id));
      }

      await tx
        .delete(classroomusers)
        .where(
          and(
            eq(classroomusers.user_id, user_id),
            eq(classroomusers.classroom_id, classroom_id),
          ),
        );
    });
  }

  async getAll(): Promise<ClassroomListResponseDto> {
    return { classrooms: await this.db.query.classrooms.findMany() };
  }

  async getAllByUserId(id: string): Promise<ClassroomListResponseDto> {
    const rows = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.user_id, id),
      with: {
        classroom: true,
      },
    });

    return { classrooms: rows.map((r) => r.classroom) };
  }

  async getById(id: string): Promise<FullClassroomResponseDto> {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, id),
    });

    if (!classroom) {
      throw new Error(`Classroom doesn't exist`);
    }
    return {
      id: classroom.id,
      name: classroom.name,
      owner_id: classroom.owner_id,
      type: classroom.type,
      created_at: classroom.created_at,
      school: classroom.school,
      verified: classroom.verified,
      sets: await this.getSetsById(classroom.id),
      users: await this.getUsersById(classroom.id),
    };
  }

  async getSetsById(id: string): Promise<FullClassroomSetDto[]> {
    const classRoomSets = await this.db.query.classroomsets.findMany({
      where: eq(classroomsets.classroom_id, id),
    });

    if (classRoomSets.length === 0) return [];

    const userIds = [...new Set(classRoomSets.map((cs) => cs.added_by))];
    const studysetIds = classRoomSets
      .filter((cs) => cs.set_type === 'studyset')
      .map((cs) => cs.set_id);
    const visualsetIds = classRoomSets
      .filter((cs) => cs.set_type === 'visualset')
      .map((cs) => cs.set_id);

    const [usersMap, studysetsMap, visualsetsMap] = await Promise.all([
      this.db.query.users
        .findMany({ where: inArray(users.id, userIds) })
        .then((rows) => new Map(rows.map((u) => [u.id, u]))),
      studysetIds.length > 0
        ? this.db.query.studysets
            .findMany({ where: inArray(studysets.id, studysetIds) })
            .then((rows) => new Map(rows.map((s) => [s.id, s])))
        : Promise.resolve(new Map()),
      visualsetIds.length > 0
        ? this.db.query.visualsets
            .findMany({ where: inArray(visualsets.id, visualsetIds) })
            .then((rows) => new Map(rows.map((vs) => [vs.id, vs])))
        : Promise.resolve(new Map()),
    ]);

    const lijst: FullClassroomSetDto[] = [];

    for (const classroomset of classRoomSets) {
      const user = usersMap.get(classroomset.added_by);
      if (!user) continue;

      const set =
        classroomset.set_type === 'studyset'
          ? studysetsMap.get(classroomset.set_id)
          : visualsetsMap.get(classroomset.set_id);

      if (set) {
        lijst.push({
          set_id: classroomset.set_id,
          set_type: classroomset.set_type,
          classroom_id: classroomset.classroom_id,
          owner: set.user_id,
          created_at: set.created_at,
          title: set.title,
          added_by: user.displayName,
        });
      }
    }

    return lijst;
  }

  async getUsersById(id: string): Promise<ClassroomUserDto[]> {
    const ClassroomUsers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.classroom_id, id),
    });

    if (ClassroomUsers.length === 0) return [];

    const userIds = ClassroomUsers.map((u) => u.user_id);
    const profileRows = await this.db.query.profiles.findMany({
      where: inArray(profiles.user_id, userIds),
    });
    const profileMap = new Map(profileRows.map((p) => [p.user_id, p]));

    return ClassroomUsers.flatMap((User) => {
      const u = profileMap.get(User.user_id);
      if (!u) return [];
      return [
        {
          user_id: User.user_id,
          classroom_id: User.classroom_id,
          role: User.role,
          joined_at: User.joined_at,
          displayName: u.displayName,
          streak: u.streak,
          verified: u.verified,
          img_url: u.img_url,
          position: 0,
        },
      ];
    });
  }

  async getActivity(id: string): Promise<ClassActivitiesDto[]> {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, id),
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom doesn't exist`);
    }

    return this.db.query.classroomactivities.findMany({
      where: eq(classroomactivities.classroom_id, id),
    });
  }

  async promoteUser(classroom_id: string, user_id: string) {
    const promotedUser = await this.db
      .update(classroomusers)
      .set({ role: 'owner' })
      .where(
        and(
          eq(classroomusers.classroom_id, classroom_id),
          eq(classroomusers.user_id, user_id),
        ),
      );

    await this.updateById(classroom_id, { owner: user_id });
    return promotedUser;
  }

  async updateById(id: string, body: UpdateClassroomDto): Promise<void> {
    const updated = await this.db
      .update(classrooms)
      .set({
        name: body.name,
        type: body.type,
        verified: body.verified,
        owner_id: body.owner,
      })
      .where(eq(classrooms.id, id))
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException('Visualset not found');
    }
  }

  async deleteById(id: string, user_id: string) {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, id),
    });

    if (!classroom) {
      throw new NotFoundException('No classroom with this id exists');
    }

    if (classroom.owner_id !== user_id) {
      throw new ForbiddenException('You do not own this classroom');
    }

    await this.db.delete(classrooms).where(eq(classrooms.id, id));
  }
}
