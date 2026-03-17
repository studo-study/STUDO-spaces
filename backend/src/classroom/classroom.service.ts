import {
  BadRequestException,
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
import { and, eq } from 'drizzle-orm';
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

    try {
      await this.db.insert(classroomsets).values(cset);
    } catch (err: any) {
      console.error('DB ERROR:', err);
      console.error('CAUSE:', err?.cause);
      throw err;
    }
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
  async remove(classroom_id: string, set: string): Promise<void> {
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
    const user = await this.db.query.classroomusers.findFirst({
      where: and(
        eq(classroomusers.classroom_id, classroom_id),
        eq(classroomusers.user_id, user_id),
      ),
    });

    if (!user) {
      throw new NotFoundException('No user with this id exists');
    }

    if (user.role === 'owner') {
      const users = (await this.getUsersById(classroom_id)).sort(
        (a, b) =>
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime(),
      );

      if (users.length < 2) {
        throw new BadRequestException('Cannot leave: you are the only member');
      }

      await this.promoteUser(classroom_id, users[1].user_id);
    }

    await this.db
      .delete(classroomusers)
      .where(eq(classroomusers.user_id, user_id))
      .returning();
  }

  async getAll(): Promise<ClassroomListResponseDto> {
    return { classrooms: await this.db.query.classrooms.findMany() };
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

    const lijst: FullClassroomSetDto[] = [];

    for (const classroomset of classRoomSets) {
      // Check of de gebruiker bestaat
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, classroomset.added_by),
      });

      if (!user) {
        console.warn(
          `User ${classroomset.added_by} not found, skipping set ${classroomset.set_id}`,
        );
        continue; // Skip deze set in plaats van error throwen
      }

      if (classroomset.set_type === 'studyset') {
        const set = await this.db.query.studysets.findFirst({
          where: eq(studysets.id, classroomset.set_id),
        });

        if (set) {
          lijst.push({
            set_id: classroomset.set_id,
            set_type: classroomset.set_type,
            classroom_id: classroomset.classroom_id,
            owner: set.user_id,
            course: set.course,
            created_at: set.created_at,
            title: set.title,
            added_by: user.displayName,
          });
        } else {
          console.warn(`Studyset ${classroomset.set_id} not found`);
        }
      }

      if (classroomset.set_type === 'visualset') {
        const set = await this.db.query.visualsets.findFirst({
          where: eq(visualsets.id, classroomset.set_id),
        });

        if (set) {
          lijst.push({
            set_id: classroomset.set_id,
            set_type: classroomset.set_type,
            classroom_id: classroomset.classroom_id,
            owner: set.user_id,
            course: set.course,
            created_at: set.created_at,
            title: set.title,
            added_by: user.displayName,
          });
        } else {
          console.warn(`Visualset ${classroomset.set_id} not found`);
        }
      }
    }

    return lijst;
  }

  async getUsersById(id: string): Promise<ClassroomUserDto[]> {
    const ClassroomUsers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.classroom_id, id),
    });

    const lijst: ClassroomUserDto[] = [];

    for (const User of ClassroomUsers) {
      const u = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, User.user_id),
      });

      if (u) {
        lijst.push({
          user_id: User.user_id,
          classroom_id: User.classroom_id,
          role: User.role,
          joined_at: User.joined_at,
          displayName: u.displayName,
          streak: u.streak,
          verified: u.verified,
          img_url: u.img_url,
          position: 0,
        });
      }
    }
    return lijst;
  }

  async getActivity(id: string): Promise<ClassActivitiesDto[]> {
    //classroomcheck
    const classroom = await this.db.query.classrooms.findFirst({
      where: eq(classrooms.id, id),
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom doesn't exist`);
    }

    const activities: ClassActivitiesDto[] =
      await this.db.query.classroomactivities.findMany({
        where: eq(classroomactivities.classroom_id, id),
      });
    return activities;
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

  async deleteById(id: string) {
    const result = await this.db
      .delete(classrooms)
      .where(eq(classrooms.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No classroom with this id exists');
    }
  }
}
