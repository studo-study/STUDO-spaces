export class CreateUserDto {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export class UpdateUsersDTO {
  email?: string;
  password?: string;
  displayName?: string;
  streak_started?: string;
  streak_count?: string;
  streak_last_update?: string;
  last_login?: string;
  hearts?: number;
  role?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  password: string;
  displayName: string;
  join_date: string;
  streak_started?: string | null;
  streak_count?: string | null;
  streak_last_update?: string | null;
  last_login: string;
  hearts: number;
  role: string;
}

export class UserListResponseDto {
  Users: UserResponseDto[];
}

//classroom_user
export class CreateClassroomUserDto {
  user_id: string;
  classroom_id: string;
  role: string;
}

export class UpdateClassroomUsersDTO {
  user_id?: string;
  classroom_id?: string;
  role?: string;
}

export class ClassroomUserResponseDto {
  user_id: string;
  classroom_id: string;
  role: string;
}

export class ClassroomUserListResponseDto {
  ClassroomUsers: ClassroomUserResponseDto[];
}
