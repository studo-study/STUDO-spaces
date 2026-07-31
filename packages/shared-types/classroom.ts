export interface CreateClassroom {
  name: string;
  type: string;
  school: string;
}

export interface UpdateClassroom {
  name?: string;
  owner?: string;
  type?: string;
  verified?: boolean;
}

export interface ClassroomResponse {
  id: string;
  name: string;
  ownerId: string;
  type: string;
  createdAt: string;
  verified: boolean;
  school: string;
}

export interface CreateClassroomSet {
  setId: string;
}

export interface CreateClassroomSets {
  sets: string[];
}

export interface ClassroomSet {
  setId: string;
  setType: string;
  classroomId: string;
  addedBy: string;
}

export interface FullClassroomSet {
  setId: string;
  setType: string;
  title: string;
  classroomId: string;
  owner: string;
  addedBy: string;
  createdAt: string;
}

export interface ClassroomUser {
  userId: string;
  classroomId: string;
  imgUrl: string;
  role: string;
  joinedAt: string;
  displayName: string;
  streak: number;
  verified: boolean;
  position: number;
}

export interface FullClassroomResponse extends ClassroomResponse {
  sets: FullClassroomSet[];
  users: ClassroomUser[];
}

export interface ClassroomListResponse {
  classrooms: ClassroomResponse[];
}

export interface CreateClassroomUser {
  classroomId: string;
  role: string;
}

export interface UpdateClassroomUsers {
  role: string;
  position: number;
}

export interface LeaveClassroom {
  classroomId: string;
}

export interface CreateClassroomActivity {
  userId: string;
  setId: string;
  classroomId: string;
}

export interface ClassroomUserResponse {
  userId: string;
  classroomId: string;
  role: string;
  joinedAt: string;
  position: number;
}

export interface CreateChallenge {
  challengeType: "time attack" | "mastery tournament" | "duel";
}

export interface ChallengeResponse {
  challengeId: string;
  challengeType: "time attack" | "mastery tournament" | "duel";
  startDate: string;
  endDate: string;
  running: boolean;
  setId: string;
  title: string;
  displayName: string;
  creatorId: string;
  classroomId: string;
}

export interface ChallengeMember {
  challengeId: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  classroomId: string;
  position: number;
  winner: boolean;
}

export interface JoinRequest {
  displayName: string;
  date: string;
  imgUrl: string;
  id: string;
}
