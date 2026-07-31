import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";
import type { Studysession } from "./studysession";

export interface AdminRecentUser {
  id: string;
  displayName: string;
  imgUrl: string;
  joinDate: string;
  publicRole: string;
  verified: boolean;
  banned: boolean;
}

export interface AdminRecentActivity {
  id: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  setId: string;
  setType: string;
  title: string;
  lastSeen: string;
  classroomId: string;
}

export interface AdminPopularSet {
  id: string;
  rank: number;
  type: "studyset" | "visualset";
  title: string;
  displayName: string;
  imgUrl: string;
  userId: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalUsersThisMonth: number;
  totalUsersLastMonth: number;
  activeUsersThisMonth: number;
  activeUsersLastMonth: number;
  totalStudysets: number;
  totalVisualsets: number;
  recentUsers: AdminRecentUser[];
  recentActivity: AdminRecentActivity[];
  popularSets: AdminPopularSet[];
}

export interface AdminUserDetailProfile {
  displayName: string;
  imgUrl: string;
  bannerUrl: string | null;
  joinDate: string;
  streak: number;
  verified: boolean;
  tags: string[];
}

export interface AdminUserDetailStudoprofile {
  displayName: string;
  imgUrl: string;
  bannerUrl: string;
  tags: string[];
  tracks: {
    id: string;
    trackName: string;
    iconName: string;
    grade: string;
  }[];
}

export interface AdminUserDetailClassroom {
  id: string;
  name: string;
  school: string;
  type: string;
  verified: boolean;
  createdAt: string;
  role: string;
  joinedAt: string;
}

export interface AdminUserDetailStats {
  totalSessions: number;
  totalTimeLearned: number;
  averageAccuracy: number;
  totalStudysets: number;
  totalVisualsets: number;
  totalClassrooms: number;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  displayName: string;
  imgUrl: string;
  joinDate: string;
  joinNumber: number;
  totalSets: number;
  streakStarted: string | null;
  streakCount: number | null;
  streakLastUpdate: string | null;
  lastLogin: string;
  roles: string[];
  publicRole: string;
  verified: boolean;
  banned: boolean;
  profile: AdminUserDetailProfile | null;
  studoprofile: AdminUserDetailStudoprofile | null;
  recentStudysets: StudysetResponse[];
  recentVisualsets: VisualsetResponse[];
  recentSessions: Studysession[];
  classrooms: AdminUserDetailClassroom[];
  stats: AdminUserDetailStats;
}
