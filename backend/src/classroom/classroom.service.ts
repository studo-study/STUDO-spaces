import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Classroom,
  CLASSROOM_SETS,
  CLASSROOM_USERS,
  CLASSROOMS,
  ClassroomSet,
  ClassroomUser,
  Studyset,
  STUDYSETS,
  User,
  USERS,
} from '../data/mock_data';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
  ClassroomSetDto,
  ClassroomSetListDto,
  ClassroomUserResponseDto,
  CreateClassroomDto,
  CreateClassroomSetDto,
  CreateClassroomUserDto,
  UpdateClassroomDto,
} from './classroom.dto';
import {
  StudysetListResponseDto,
  StudysetResponseDto,
} from '../studyset/studyset.dto';
import { UserListResponseDto, UserResponseDto } from '../user/users.dto';

@Injectable()
export class ClassroomService {
  create(classroom: CreateClassroomDto): ClassroomResponseDto {
    const uid = uuidv4.toString();
    const date = new Date();
    const Class: ClassroomResponseDto = {
      id: uid,
      name: classroom.name,
      owner: classroom.owner,
      type: classroom.type,
      created_at: date.toISOString(),
      verified: false,
    };

    const owner: ClassroomUserResponseDto = {
      user_id: classroom.owner,
      classroom_id: uid,
      role: 'owner',
    };

    CLASSROOMS.push(Class);
    CLASSROOM_USERS.push(owner);
    return Class;
  }

  add(set: CreateClassroomSetDto) {
    const cset: ClassroomSetDto = {
      set_id: set.set_id,
      classroom_id: set.classroom_id,
    };

    CLASSROOM_SETS.push(cset);
    return cset;
  }

  remove(set: ClassroomSetDto) {
    throw new Error('not yet implemented');
  }

  join(user: CreateClassroomUserDto) {
    const u = {
      user_id: user.user_id,
      classroom_id: user.classroom_id,
      role: 'participant',
    };

    CLASSROOM_USERS.push(u);
    return u;
  }

  leave(user: ClassroomUserResponseDto) {
    CLASSROOM_USERS.splice(CLASSROOM_USERS.indexOf(user), 1);
  }

  getAll(): ClassroomListResponseDto {
    return { classrooms: CLASSROOMS };
  }

  getById(id: string): ClassroomResponseDto {
    const classroom = CLASSROOMS.find(
      (classroom: Classroom) => classroom.id === id,
    );

    if (!classroom) {
      throw new Error(`Classroom doesn't exist`);
    }
    return classroom;
  }

  getSetsById(id: string): StudysetListResponseDto {
    const classRoomSet: ClassroomSetListDto = {
      sets: CLASSROOM_SETS.filter(
        (classSet: ClassroomSet) => classSet.classroom_id === id,
      ),
    };

    const list: StudysetListResponseDto = {
      sets: classRoomSet.sets.map(
        (classSet: ClassroomSet): StudysetResponseDto => {
          const studyset = STUDYSETS.find(
            (set: Studyset) => set.id === classSet.set_id,
          );
          if (!studyset) {
            throw new Error('Studyset niet gevonden');
          }
          return studyset as StudysetResponseDto;
        },
      ),
    };

    return list;
  }

  getUsers(id: string): UserListResponseDto {
    const classRoomUsers = CLASSROOM_USERS.filter(
      (classUser: ClassroomUser) => classUser.classroom_id === id,
    );

    const users: UserListResponseDto = {
      Users: USERS.filter((user: User) =>
        classRoomUsers.some(
          (classUser: ClassroomUser) => classUser.user_id === user.id,
        ),
      ) as UserResponseDto[],
    };

    return users;
  }

  updateById(id: string, set: UpdateClassroomDto): void {
    throw new Error('not yet implemented');
  }

  deleteById(id: string): string {
    return 'Not Yet implemented';
  }
}
