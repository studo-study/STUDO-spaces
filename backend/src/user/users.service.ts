import { Injectable } from '@nestjs/common';
import {
  Classroom,
  CLASSROOM_USERS,
  CLASSROOMS,
  ClassroomUser,
  User,
  USERS,
} from '../data/mock_data';
import { v4 as uuidv4 } from 'uuid';
import {
  ClassroomUserResponseDto,
  CreateUserDto,
  UpdateUsersDTO,
  UserListResponseDto,
  UserResponseDto,
} from './users.dto';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
} from '../classroom/classroom.dto';

@Injectable()
export class UserService {
  create({
    email,
    password,
    displayName,
    role,
  }: CreateUserDto): UserResponseDto {
    const date = new Date();
    const newUser = {
      id: uuidv4.toString(),
      email: email,
      password: password,
      displayName: displayName,
      join_date: date.toISOString(), // Gebruik een volledige datum
      streak_started: '', // Standaard lege string
      streak_count: '', // Standaard lege string
      streak_last_update: '', // Standaard lege string
      last_login: date.toISOString(),
      hearts: 0,
      role: role,
    };
    USERS.push(newUser);
    return newUser;
  }

  getAll(): UserListResponseDto {
    return { Users: USERS };
  }

  getById(id: string): UserResponseDto {
    const User = USERS.find((u: User) => u.id === id);

    if (!User) {
      throw new Error('No user with this id exists');
    }

    return User;
  }

  updateById(
    id: string,
    {
      email,
      password,
      displayName,
      role,
      streak_started,
      streak_count,
      streak_last_update,
      last_login,
      hearts,
    }: UpdateUsersDTO,
  ) {
    throw new Error('not yet implemented');
  }

  deleteById(id: string) {
    throw new Error('not yet implemented');
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
}
