export class CreateClassroomDto {
  name: string;
  owner: string;
  type: string;
  created_at: string;
  verified: boolean;
}

export class UpdateClassroomDto {
  name?: string;
  owner?: string;
  type?: string;
  verified?: boolean;
}

export class ClassroomResponseDto {
  id: string;
  name: string;
  owner: string;
  type: string;
  created_at: string;
  verified: boolean;
}

export class ClassroomListResponseDto {
  classrooms: ClassroomResponseDto[];
}

//classroom sets
export class CreateClassroomSetDto {
  set_id: string;
  classroom_id: string;
}

export class ClassroomSetDto {
  set_id: string;
  classroom_id: string;
}

export class ClassroomSetListDto {
  sets: ClassroomSetDto[];
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
