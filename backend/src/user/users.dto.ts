export class CreateUserDto {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export class UpdateUserDTO {
  email?: string;
  password?: string;
  displayName?: string;
  img_url?: string;
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
  img_url: string;
  join_date: string;
  joinNumber: number;
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
