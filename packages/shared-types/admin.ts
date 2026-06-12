import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";
import type { Studysession } from "./studysession";

export interface AdminRecentUser {
  id: string;
  displayName: string;
  img_url: string;
  join_date: string;
  publicRole: string;
  verified: boolean;
  banned: boolean;
}

export interface AdminRecentActivity {
  id: string;
  user_id: string;
  displayName: string;
  img_url: string;
  set_id: string;
  set_type: string;
  title: string;
  last_seen: string;
  classroom_id: string;
}

export interface AdminPopularSet {
  id: string;
  rank: number;
  type: "studyset" | "visualset";
  title: string;
  displayName: string;
  img_url: string;
  user_id: string;
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
  img_url: string;
  banner_url: string | null;
  join_date: string;
  streak: number;
  verified: boolean;
  tags: string[];
}

export interface AdminUserDetailStudoprofile {
  displayName: string;
  img_url: string;
  banner_url: string;
  tags: string[];
  tracks: {
    id: string;
    trackName: string;
    icon_name: string;
    grade: string;
  }[];
}

export interface AdminUserDetailClassroom {
  id: string;
  name: string;
  school: string;
  type: string;
  verified: boolean;
  created_at: string;
  role: string;
  joined_at: string;
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
  img_url: string;
  join_date: string;
  joinNumber: number;
  totalSets: number;
  streak_started: string | null;
  streak_count: number | null;
  streak_last_update: string | null;
  last_login: string;
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
