import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Cards,
  CARDS,
  Classroom,
  CLASSROOM_USERS,
  CLASSROOMS,
  ClassroomUser,
  FOLDERS,
  PROFILES,
  SESSIONS,
  Studysession,
  Studyset,
  STUDYSETS,
  User,
  USERS,
} from '../data/mock_data';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateUserDto,
  UpdateUserDTO,
  UserListResponseDto,
  UserResponseDto,
} from './users.dto';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
  ClassroomUserResponseDto,
} from '../classroom/classroom.dto';
import {
  StudysetListResponseDto,
  StudysetResponseDto,
} from '../studyset/studyset.dto';
import { TotalStats } from '../studysession/studysession.dto';
import { ProfileDto } from '../profile/profile.dto';

@Injectable()
export class UserService {
  create({
    email,
    password,
    displayName,
    role,
  }: CreateUserDto): UserResponseDto {
    const date = new Date();
    const uid = uuidv4.toString();
    const joinDate = date.toISOString();
    const joinNumber = USERS.length + 1;
    //user
    const newUser = {
      id: uid,
      email: email,
      password: password,
      displayName: displayName,
      img_url: '',
      join_date: joinDate,
      joinNumber: joinNumber,
      streak_started: '',
      streak_count: '',
      streak_last_update: '',
      last_login: date.toISOString(),
      hearts: 0,
      role: role,
    };

    //profile
    const newProfile = {
      user_id: uid,
      email: email,
      displayName: displayName,
      img_url: '',
      joinDate: date.toISOString(),
      streak: 0,
      joinNumber: joinNumber,
    };

    //rootfolder
    const rootFolder = {
      id: uuidv4.toString(),
      name: `${displayName}' folder`,
      user_id: uid,
    };

    USERS.push(newUser);
    PROFILES.push(newProfile);
    FOLDERS.push(rootFolder);
    return newUser;
  }

  getAll(): UserListResponseDto {
    return { Users: USERS };
  }

  getById(user_id: string): UserResponseDto {
    const User = USERS.find((u: User) => u.id === user_id);

    if (!User) {
      throw new Error('No user with this id exists');
    }

    return User;
  }

  getTotalStats(user_id: string): TotalStats {
    const number = CARDS.filter((c: Cards) => c.owner_id === user_id).reduce(
      (pv: number, card) => {
        if (card.card_totalviewcount > 2) {
          return (pv += 1);
        }
      },
      0,
    );

    if (!number) {
      throw new Error('there are no cards');
    }

    return {
      joinNumber: 1,
      joinDate: 'joindate',
      totalsets: STUDYSETS.length,
      timeLearned: SESSIONS.reduce(
        (pv: number, sesh: Studysession) => pv + sesh.duration,
        0,
      ),
      cardsLearned: number,
    };
  }

  getAllSetsById(user_id: string): StudysetListResponseDto {
    return {
      sets: STUDYSETS.filter(
        (set: StudysetResponseDto) => set.user_id === user_id,
      ),
    };
  }

  getSetById(user_id: string, set_id: string) {
    const set = STUDYSETS.find((item: Studyset) => item.id === set_id);
    if (!set) throw new NotFoundException('Studyset not found');
    if (set.user_id !== user_id) throw new ForbiddenException('Access denied');

    return {
      ...set,
      cards: {
        cards: CARDS.filter((item: Cards) => item.set_id === set_id),
      },
    };
  }

  getAllClassroomsByUserId(userId: string): ClassroomListResponseDto {
    const classroomUsers: ClassroomUserResponseDto[] = CLASSROOM_USERS.filter(
      (u: ClassroomUser) => u.user_id === userId,
    );

    const classIds: string[] = classroomUsers.map(
      (u: ClassroomUserResponseDto) => u.classroom_id,
    );

    return {
      classrooms: CLASSROOMS.filter((classroom) =>
        classIds.includes(classroom.id),
      ),
    };
  }

  getClassroomByUserId(
    userId: string,
    ClassroomId: string,
  ): ClassroomResponseDto {
    const classroomUsers: ClassroomUserResponseDto[] = CLASSROOM_USERS.filter(
      (u: ClassroomUser) => u.user_id === userId,
    );

    const classIds: string[] = classroomUsers.map(
      (u: ClassroomUserResponseDto) => u.classroom_id,
    );

    if (classIds.includes(ClassroomId)) {
      const classroom = CLASSROOMS.find(
        (room: Classroom) => room.id === ClassroomId,
      );

      if (!classroom) {
        throw new Error('Classroom not found');
      }

      return classroom as ClassroomResponseDto;
    }

    throw new Error('User is not a member of this classroom');
  }

  updateById(user_id: string, updateBody: UpdateUserDTO) {
    throw new Error('not yet implemented');
  }

  deleteById(user_id: string) {
    throw new Error('not yet implemented');
  }

  //TODO
  uploadProfilePicutre(user_id: string, body: any) {
    throw new Error('not yet implemented');
  }
}
