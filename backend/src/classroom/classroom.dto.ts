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
