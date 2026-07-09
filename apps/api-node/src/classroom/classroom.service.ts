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
    userId: string,
    classroom: CreateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    const uid = uuidv4();
    const date = new Date();

    const Class: ClassroomResponseDto = {
      id: uid,
      name: classroom.name,
      ownerId: userId,
      type: classroom.type,
      createdAt: date.toISOString(),
      verified: false,
      school: classroom.school,
    };

    const owner: ClassroomUserResponseDto = {
      userId: userId,
      classroomId: uid,
      role: 'owner',
      joinedAt: date.toISOString(),
      position: 0,
    };

    await this.db.insert(classrooms).values(Class);
    await this.db.insert(classroomusers).values(owner);
    return Class;
  }

  async add(
    classroomId: string,
    setId: string,
    userId: string,
  ): Promise<ClassroomSetDto> {
    const studyset = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, setId),
    });
    const visualset = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, setId),
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
      setId: set.id,
      setType: type,
      classroomId: classroomId,
      addedBy: userId,
    };

    await this.db.insert(classroomsets).values(cset);

    return cset;
  }

  async addSets(
    classroomId: string,
    userId: string,
    body: CreateClassroomSetsDto,
  ): Promise<ClassroomSetDto[]> {
    const sets: ClassroomSetDto[] = [];
    for (const s of body.sets) {
      const set = await this.add(classroomId, s, userId);
      sets.push(set);
    }
    return sets;
  }

  async createActivity(
    userId: string,
    classroomId: string,
    activityDto: CreateClassroomActivityDto,
  ): Promise<ClassActivitiesDto> {
    // Classroom check
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, classroomId),
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom doesn't exist`);
    }

    // Check of user al activity heeft en verwijder die
    const oldActivity = await this.db.query.classroomactivities.findFirst({
      where: and(
        eq(classroomactivities.userId, userId),
        eq(classroomactivities.classroomId, classroomId),
      ),
    });

    if (oldActivity) {
      await this.db
        .delete(classroomactivities)
        .where(
          and(
            eq(classroomactivities.userId, userId),
            eq(classroomactivities.classroomId, classroomId),
          ),
        );
    }

    const date = new Date();
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!user) {
      throw new NotFoundException(`User profile doesn't exist`);
    }

    let set_type: string;
    let set: any;

    const studyset = await this.db.query.studysets.findFirst({
      where: eq(studysets.id, activityDto.setId),
    });

    if (studyset) {
      set_type = 'studyset';
      set = studyset;
    } else {
      const visualset = await this.db.query.visualsets.findFirst({
        where: eq(visualsets.id, activityDto.setId),
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
      classroomId: classroomId,
      userId: userId,
      displayName: user.displayName,
      imgUrl: user.imgUrl,
      setId: activityDto.setId,
      setType: set_type,
      title: set.title,
      lastSeen: date.toISOString(),
    };

    // Inserten en returnen
    await this.db.insert(classroomactivities).values(newActivity);
    return newActivity;
  }
  async remove(
    classroomId: string,
    set: string,
    userId: string,
  ): Promise<void> {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, classroomId),
    });

    if (!classroom) {
      throw new NotFoundException('No classroom with this id exists');
    }

    if (classroom.ownerId !== userId) {
      throw new ForbiddenException('You do not own this classroom');
    }

    const result = await this.db
      .delete(classroomsets)
      .where(
        and(
          eq(classroomsets.setId, set),
          eq(classroomsets.classroomId, classroomId),
        ),
      )
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No classroomset with this id exists');
    }
  }

  async join(
    userId: string,
    user: CreateClassroomUserDto,
  ): Promise<ClassroomUserResponseDto> {
    const date = new Date();
    const u = {
      userId: userId,
      classroomId: user.classroomId,
      role: user.role,
      joinedAt: date.toISOString(),
      position: 0,
    };

    await this.db.insert(classroomusers).values(u);
    return u;
  }

  async leave(userId: string, classroomId: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const user = await tx.query.classroomusers.findFirst({
        where: and(
          eq(classroomusers.classroomId, classroomId),
          eq(classroomusers.userId, userId),
        ),
      });

      if (!user) {
        throw new NotFoundException('No user with this id exists');
      }

      if (user.role === 'owner') {
        const members = await tx.query.classroomusers.findMany({
          where: eq(classroomusers.classroomId, classroomId),
        });

        if (members.length < 2) {
          throw new BadRequestException(
            'Cannot leave: you are the only member',
          );
        }

        const nextOwner = members
          .filter((m) => m.userId !== userId)
          .sort(
            (a, b) =>
              new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
          )[0];

        await tx
          .update(classroomusers)
          .set({ role: 'owner' })
          .where(
            and(
              eq(classroomusers.classroomId, classroomId),
              eq(classroomusers.userId, nextOwner.userId),
            ),
          );

        await tx
          .update(classrooms)
          .set({ ownerId: nextOwner.userId })
          .where(eq(classrooms.id, classroomId));
      }

      await tx
        .delete(classroomusers)
        .where(
          and(
            eq(classroomusers.userId, userId),
            eq(classroomusers.classroomId, classroomId),
          ),
        );
    });
  }

  async getAll(): Promise<ClassroomListResponseDto> {
    return { classrooms: await this.db.query.classrooms.findMany() };
  }

  async getAllByUserId(id: string): Promise<ClassroomListResponseDto> {
    const rows = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.userId, id),
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
      ownerId: classroom.ownerId,
      type: classroom.type,
      createdAt: classroom.createdAt,
      school: classroom.school,
      verified: classroom.verified,
      sets: await this.getSetsById(classroom.id),
      users: await this.getUsersById(classroom.id),
    };
  }

  async getSetsById(id: string): Promise<FullClassroomSetDto[]> {
    const classRoomSets = await this.db.query.classroomsets.findMany({
      where: eq(classroomsets.classroomId, id),
    });

    if (classRoomSets.length === 0) return [];

    const userIds = [...new Set(classRoomSets.map((cs) => cs.addedBy))];
    const studysetIds = classRoomSets
      .filter((cs) => cs.setType === 'studyset')
      .map((cs) => cs.setId);
    const visualsetIds = classRoomSets
      .filter((cs) => cs.setType === 'visualset')
      .map((cs) => cs.setId);

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
      const user = usersMap.get(classroomset.addedBy);
      if (!user) continue;

      const set =
        classroomset.setType === 'studyset'
          ? studysetsMap.get(classroomset.setId)
          : visualsetsMap.get(classroomset.setId);

      if (set) {
        lijst.push({
          setId: classroomset.setId,
          setType: classroomset.setType,
          classroomId: classroomset.classroomId,
          owner: set.userId,
          createdAt: set.created_at,
          title: set.title,
          addedBy: user.displayName,
        });
      }
    }

    return lijst;
  }

  async getUsersById(id: string): Promise<ClassroomUserDto[]> {
    const ClassroomUsers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.classroomId, id),
    });

    if (ClassroomUsers.length === 0) return [];

    const userIds = ClassroomUsers.map((u) => u.userId);
    const profileRows = await this.db.query.profiles.findMany({
      where: inArray(profiles.userId, userIds),
    });
    const profileMap = new Map(profileRows.map((p) => [p.userId, p]));

    return ClassroomUsers.flatMap((User) => {
      const u = profileMap.get(User.userId);
      if (!u) return [];
      return [
        {
          userId: User.userId,
          classroomId: User.classroomId,
          role: User.role,
          joinedAt: User.joinedAt,
          displayName: u.displayName,
          streak: u.streak,
          verified: u.verified,
          imgUrl: u.imgUrl,
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
      where: eq(classroomactivities.classroomId, id),
    });
  }

  async promoteUser(classroomId: string, userId: string) {
    const promotedUser = await this.db
      .update(classroomusers)
      .set({ role: 'owner' })
      .where(
        and(
          eq(classroomusers.classroomId, classroomId),
          eq(classroomusers.userId, userId),
        ),
      );

    await this.updateById(classroomId, { owner: userId });
    return promotedUser;
  }

  async updateById(id: string, body: UpdateClassroomDto): Promise<void> {
    const updated = await this.db
      .update(classrooms)
      .set({
        name: body.name,
        type: body.type,
        verified: body.verified,
        ownerId: body.owner,
      })
      .where(eq(classrooms.id, id))
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException('Visualset not found');
    }
  }

  async deleteById(id: string, userId: string) {
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, id),
    });

    if (!classroom) {
      throw new NotFoundException('No classroom with this id exists');
    }

    if (classroom.ownerId !== userId) {
      throw new ForbiddenException('You do not own this classroom');
    }

    await this.db.delete(classrooms).where(eq(classrooms.id, id));
  }
}
