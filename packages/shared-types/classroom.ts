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
  owner_id: string;
  type: string;
  created_at: string;
  verified: boolean;
  school: string;
}

export interface CreateClassroomSet {
  set_id: string;
}

export interface CreateClassroomSets {
  sets: string[];
}

export interface ClassroomSet {
  set_id: string;
  set_type: string;
  classroom_id: string;
  added_by: string;
}

export interface FullClassroomSet {
  set_id: string;
  set_type: string;
  title: string;
  course: string;
  classroom_id: string;
  owner: string;
  added_by: string;
  created_at: string;
}

export interface ClassroomUser {
  user_id: string;
  classroom_id: string;
  img_url: string;
  role: string;
  joined_at: string;
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
  classroom_id: string;
  role: string;
}

export interface UpdateClassroomUsers {
  role: string;
  position: number;
}

export interface LeaveClassroom {
  classroom_id: string;
}

export interface CreateClassroomActivity {
  user_id: string;
  set_id: string;
  classroom_id: string;
}

export interface ClassroomUserResponse {
  user_id: string;
  classroom_id: string;
  role: string;
  joined_at: string;
  position: number;
}

export interface CreateChallenge {
  challengeType: "time attack" | "mastery tournament" | "duel";
}

export interface ChallengeResponse {
  challenge_id: string;
  challengeType: "time attack" | "mastery tournament" | "duel";
  start_date: string;
  end_date: string;
  running: boolean;
  set_id: string;
  title: string;
  display_name: string;
  creator_id: string;
  classroom_id: string;
}

export interface ChallengeMember {
  challenge_id: string;
  user_id: string;
  display_name: string;
  img_url: string;
  classroom_id: string;
  position: number;
  winner: boolean;
}

export interface JoinRequest {
  displayName: string;
  date: string;
  img_url: string;
  id: string;
}
