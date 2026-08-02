// lib/api/shared-types.ts
// Auto-generated from NestJS DTOs - Keep in sync!

// ============================================
// NEXTAUTH TYPE EXTENSIONS
// ============================================

import { SuggestionImage } from "@studo/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: StudoUser;
    accessToken: string;
  }

  interface User extends StudoUser {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    user: StudoUser;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// ============================================================
// REGISTER USER
// ============================================================

export interface RegisterUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================================
// USER / PROFILE
// ============================================================

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  displayName?: string;
  imgUrl?: string;
  streakStarted?: string;
  streakCount?: number;
  streakLastUpdate?: string;
  lastLogin?: string;
  role?: string;
}

export interface User {
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
  publicRole: string;
  verified: boolean;
}

export interface Stats {
  totalsets: number;
  timeLearned: number;
  cardsLearned: number;
}

export interface LastStudied {
  setId: string;
  id: string;
  lastStudied: string;
  title: string;
  type: string;
  progress: number;
  length: number;
}

export interface UserWithStats extends User {
  stats: UserStats;
  lastTen: LastStudied[];
}

export interface UserListResponse {
  users: User[];
}

export interface HeaderInfo {
  displayName: string;
  email: string;
  streakCount: number | null;
  pfp: string;
}

export interface ClassActivity {
  id: string;
  classroomId: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  setId: string;
  setType: string;
  title: string;
  lastSeen: string;
}

export interface StartPage {
  lastTen: LastStudied[];
  class: ClassActivity[];
}

// ============================================================
// CARDS
// ============================================================

export interface CreateCard {
  term: string;
  definition: string;
  image?: string | null;
  number: number;
}

export interface UpdateCard {
  id: string;
  term?: string;
  definition?: string;
  number?: number;
  updatedAt?: string;
}

export interface Card {
  id: string;
  term: string;
  definition: string;
  number: number;
  termContentType: "text" | "latex" | "code";
  codeLanguage: string;
  createdAt: string;
  updatedAt: string;
  setId: string;
  ownerId: string;
  suggestionImageId?: string | null;
  suggestionImage?: SuggestionImage | null;
}

export interface CardListResponse {
  cards: Card[];
}

// ============================================================
// SET LIKES
// ============================================================

export interface CreateSetLike {
  setId: string;
}

export interface SetLike {
  id: string;
  userId: string;
  setId: string;
  setType: "studyset" | "visualset";
  createdAt: string;
}

export interface SetLikeListResponse {
  likes: SetLike[];
}

// ============================================================
// STUDYSETS
// ============================================================

export interface CreateStudyset {
  title: string;
  globalTermLanguage: string;
  globalDefinitionLanguage: string;
  flowcourseId?: string;
  cardlist: CreateCard[];
}

export interface UpdateStudyset {
  title?: string;
  globalTermLanguage?: string;
  globalDefinitionLanguage?: string;
  publicSet?: boolean;
  cards?: UpdateCard[];
}

export interface Studyset {
  id: string;
  title: string;
  globalTermLanguage: string;
  globalDefinitionLanguage: string;
  createdAt: string;
  lastUpdated: string;
  publicSet: boolean;
  displayName: string;
  imgUrl: string;
  userId: string;
}

export interface FullStudyset extends Studyset {
  cards: Card[];
  likes: SetLike[];
  session: StudySession | null;
  classrooms?: Classroom[];
}

export interface StudysetListResponse {
  sets: Studyset[];
}

export interface AllSetsResponse {
  studysets: Studyset[];
  visualsets: Visualset[];
}

// ============================================================
// VISUALSETS
// ============================================================

export interface CreateImage {
  title: string;
  url: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
}

export interface UpdateImage extends CreateImage {
  id: string;
}

export interface Image {
  id: string;
  title: string;
  url: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
  setId: string;
}

export interface ImageWithPins extends Image {
  pins: PinListResponse;
}

export interface CreateVisualset {
  title: string;
  images: CreateImage[];
  pins: CreatePin[];
}

export interface UpdateVisualset {
  title?: string;
  publicSet?: boolean;
  images?: UpdateImage[];
  pins?: UpdatePin[];
}

export interface Visualset {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  publicSet: boolean;
  userId: string;
  displayName: string;
  imgUrl: string;
}

export interface FullVisualset extends Visualset {
  images: ImageWithPins[];
  likes: SetLikeListResponse;
  session?: StudySession;
  classrooms?: Classroom[];
}

export interface VisualsetListResponse {
  visualsets: Visualset[];
}

// ============================================================
// PINS (for Visualsets)
// ============================================================

export interface CreatePin {
  number: number;
  definition: string;
  x: number;
  y: number;
  imageId: string;
}

export interface UpdatePin extends Partial<CreatePin> {
  id: string;
}

export interface Pin {
  id: string;
  number: number;
  definition: string;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
  imageId: string;
  setId: string;
  ownerId: string;
}

export interface PinListResponse {
  pins: Pin[];
}

// ============================================================
// ============================================================
// CLASSROOMS
// ============================================================

export interface CreateClassroom {
  name: string;
  type: string;
}

export interface UpdateClassroom {
  name?: string;
  owner?: string;
  type?: string;
  verified?: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  ownerId: string;
  type: string;
  createdAt: string;
  verified: boolean;
  school: string;
  public: boolean;
}

export interface ClassroomSet {
  setId: string;
  setType: string;
  classroomId: string;
  addedBy: string;
}

export interface FullClassroomSet extends ClassroomSet {
  title: string;
  owner: string;
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

export interface FullClassroom extends Classroom {
  sets: FullClassroomSet[];
  users: ClassroomUser[];
}

export interface ClassroomListResponse {
  classrooms: Classroom[];
}

export interface CreateClassroomUser {
  classroomId: string;
  role: string;
}

export interface UpdateClassroomUser {
  role: string;
}

export interface CreateClassroomSet {
  setId: string;
}

export interface CreateClassroomSets {
  sets: string[];
}

export interface CreateClassroomActivity {
  userId: string;
  setId: string;
  classroomId: string;
}

// ============================================================
// STUDY SESSIONS
// ============================================================

export interface StudySession {
  id: string;
  startedAt: string;
  durationMin: number;
  endedAt?: string;
  index: number;
  accuracy: number;
  averageResponseTime: number;
  longestFocusStreak: number;
  lastSeen?: string;
  lastStudied?: string;
  userId: string;
  setId: string;
  setType: "studyset" | "visualset";
  cards: SessionCard[];
}

export interface SessionCard {
  id: string;
  number: number;
  cardViewcount: number;
  cardTotalViewcount: number;
  inQueue: boolean;
  mastered: boolean;
  timesRelearned: number;
  cardId: string;
  sessionId: string;
  ownerId: string;
  flagged: boolean;
}

export interface SessionPin {
  id: string;
  number: number;
  pinViewcount: number;
  pinTotalViewcount: number;
  inQueue: boolean;
  mastered: boolean;
  timesRelearned: number;
  pinId: string;
  sessionId: string;
  ownerId: string;
  flagged: boolean;
}

// ============================================================
// SEARCH
// ============================================================

export interface SearchSetResult {
  id: string;
  title: string;
  subject: string;
  lastStudied?: string;
  owner: string;
  imgUrl: string;
  ownerId: string;
  verified: boolean;
  likes: number;
  items: number;
  type: "studyset" | "visualset";
}

export interface SearchProfileResult {
  id: string;
  displayName: string;
  imgUrl: string;
  studoProfile: boolean;
  profileType: string;
  type: "profile";
}

export interface SearchClassroomResult {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  type: "classroom";
  verified: boolean;
}

export interface SearchResults {
  data: [
    { type: "set"; data: SearchSetResult[] },
    { type: "profile"; data: SearchProfileResult[] },
    { type: "classroom"; data: SearchClassroomResult[] },
  ];
}

// ============================================================
// GENERIC API TYPES
// ============================================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// TYPE GUARDS (handig voor runtime checks)
// ============================================================

export function isStudyset(set: Studyset | Visualset): set is Studyset {
  return "global_term_language" in set;
}

export function isVisualset(set: Studyset | Visualset): set is Visualset {
  return !("global_term_language" in set);
}

export function isFullStudyset(
  set: Studyset | FullStudyset,
): set is FullStudyset {
  return "cards" in set;
}

export function isFullVisualset(
  set: Visualset | FullVisualset,
): set is FullVisualset {
  return "images" in set;
}

// ============================================================
// UNION TYPES (voor gecombineerde views)
// ============================================================

export type AnySet = Studyset | Visualset;
export type AnyFullSet = FullStudyset | FullVisualset;
export type SetType = "studyset" | "visualset";

export interface SetIdentifier {
  id: string;
  type: SetType;
}

// shared-types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// ============================================
// JOUW USER TYPES
// ============================================

export interface UserStats {
  totalsets: number;
  timeLearned: number;
  cardsLearned: number;
}

interface RecentSet {
  setId: string;
  lastStudied: string;
  title: string;
  type: "studyset" | "visualset";
  progress: number;
  length: number;
}

export interface StudoUser {
  id: string;
  email: string;
  displayName: string;
  imgUrl: string;
  joinDate: string;
  joinNumber: number;
  totalSets: number;
  streakCount: number;
  streakLastUpdate: string;
  publicRole: "owner" | "admin" | "user"; // pas aan naar jouw rollen
  verified: boolean;
  stats: UserStats;
  lastTen: RecentSet[];
}

// ============================================
// CHALLENGES
// ============================================

export interface ChallengeResponseDTO {
  challengeId: string;
  challengeType: "time attack" | "mastery tournament" | "duel";
  startDate: string;
  endDate: string;
  running: boolean;
  title: string;
  setId: string;
  displayName: string;
  creatorId: string;
  classroomId: string;
}

export interface ChallengeMemberDTO {
  challengeId: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  classroomId: string;
  position: number;
  winner: boolean;
}

export interface ProfileDto {
  userId: string;
  displayName: string;
  imgUrl: string;
  bannerUrl: string | null;
  joinDate: string;
  joinNumber: number;
  streak: number;
  verified: boolean;
  studoProfile: boolean;
}

export interface ProfileResponseDto {
  profile: ProfileDto;
  studysets: Studyset[];
  visualsets: Visualset[];
}

export interface CardData {
  id: string;
  index: number;
  term: string;
  definition: string;
  image: SuggestionImage | null;
  isDouble: boolean;
  contentType: "text" | "latex" | "code";
  codeLanguage: string;
}

export interface Issue {
  id: string;
  reportId: string;
  filledBy: number;
  title: string;
  reportType: string;
  description: string;
  targetId: string;
  targetType: string;
  reportedUserId: number;
  status: string;
  priority: string | null;
  createdAt: string | null;
  resolvedAt: string | null;
  reviewedBy: number | null;
  moderatorNote: string | null;
  assigneeId: string | null;
  assignee_displayName: string | null;
  number: number;
}
