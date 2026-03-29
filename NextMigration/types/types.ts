// lib/api/types.ts
// Auto-generated from NestJS DTOs - Keep in sync!

// ============================================
// NEXTAUTH TYPE EXTENSIONS
// ============================================

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: StudoUser;
        accessToken: string;
    }

    interface User extends StudoUser {
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
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
    img_url?: string;
    streak_started?: string;
    streak_count?: number;
    streak_last_update?: string;
    last_login?: string;
    role?: string;
}

export interface User {
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
    publicRole: string;
    verified: boolean;
}

export interface Stats {
    totalsets: number;
    timeLearned: number;
    cardsLearned: number;
}

export interface LastStudied {
    id: string;
    last_studied: string;
    title: string;
    course: string;
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
    streak_count: number | null;
    pfp: string;
}

export interface ClassActivity {
    id: string;
    classroom_id: string;
    user_id: string;
    displayName: string;
    img_url: string;
    set_id: string;
    set_type: string;
    title: string;
    last_seen: string;
}

export interface StartPage {
    lastTen: LastStudied[];
    courses: string[];
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
    updated_at?: string;
}

export interface Card {
    id: string;
    term: string;
    definition: string;
    number: number;
    created_at: string;
    updated_at: string;
    set_id: string;
    owner_id: string;
}

export interface CardListResponse {
    cards: Card[];
}

// ============================================================
// SET LIKES
// ============================================================

export interface CreateSetLike {
    set_id: string;
}

export interface SetLike {
    id: string;
    user_id: string;
    set_id: string;
    set_type: 'studyset' | 'visualset';
    created_at: string;
}

export interface SetLikeListResponse {
    likes: SetLike[];
}

// ============================================================
// STUDYSETS
// ============================================================

export interface CreateStudyset {
    title: string;
    course: string;
    global_term_language: string;
    global_definition_language: string;
    folder_id: string;
    cardlist: CreateCard[];
}

export interface UpdateStudyset {
    title?: string;
    course?: string;
    global_term_language?: string;
    global_definition_language?: string;
    public_set?: boolean;
    cards?: UpdateCard[];
}

export interface Studyset {
    id: string;
    title: string;
    course: string;
    global_term_language: string;
    global_definition_language: string;
    created_at: string;
    last_updated: string;
    public_set: boolean;
    displayName: string;
    img_url: string;
    user_id: string;
    folder_id: string;
}

export interface FullStudyset extends Studyset {
    cards: Card[];
    likes: SetLike[];
    session: StudySession;
    classrooms?: Classroom[];
    folders?: Folder[];
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
    grid_x: number;
    grid_y: number;
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
    grid_x: number;
    grid_y: number;
    scale: string;
    set_id: string;
}

export interface ImageWithPins extends Image {
    pins: PinListResponse;
}

export interface CreateVisualset {
    title: string;
    subject: string;
    folder_id: string;
    images: CreateImage[];
    pins: CreatePin[];
}

export interface UpdateVisualset {
    title?: string;
    public_set?: boolean;
    course?: string;
    folder_id?: string;
    images?: UpdateImage[];
    pins?: UpdatePin[];
}

export interface Visualset {
    id: string;
    title: string;
    course: string;
    created_at: string;
    last_updated: string;
    public_set: boolean;
    user_id: string;
    displayName: string;
    img_url: string;
    folder_id: string;
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
    image_id: string;
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
    created_at: string;
    updated_at: string;
    image_id: string;
    set_id: string;
    owner_id: string;
}

export interface PinListResponse {
    pins: Pin[];
}

// ============================================================
// FOLDERS
// ============================================================

export interface CreateFolder {
    name: string;
}

export interface UpdateFolder {
    name?: string;
}

export interface Folder {
    id: string;
    name: string;
    owner_id: string;
}

export interface FolderSets {
    studysets: Studyset[];
    visualsets: Visualset[];
}

export interface FullFolder extends Folder {
    sets: FolderSets;
}

export interface FolderListResponse {
    folders: Folder[];
}

export interface SwitchFolderRequest {
    user_id: string;
    set_id: string;
    destinationFolder_id: string;
}

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
    owner_id: string;
    type: string;
    created_at: string;
    verified: boolean;
    school: string;
    public: boolean;
}

export interface ClassroomSet {
    set_id: string;
    set_type: string;
    classroom_id: string;
    added_by: string;
}

export interface FullClassroomSet extends ClassroomSet {
    title: string;
    course: string;
    owner: string;
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

export interface FullClassroom extends Classroom {
    sets: FullClassroomSet[];
    users: ClassroomUser[];
}

export interface ClassroomListResponse {
    classrooms: Classroom[];
}

export interface CreateClassroomUser {
    classroom_id: string;
    role: string;
}

export interface UpdateClassroomUser {
    role: string;
}

export interface CreateClassroomSet {
    set_id: string;
}

export interface CreateClassroomSets {
    sets: string[];
}

export interface CreateClassroomActivity {
    user_id: string;
    set_id: string;
    classroom_id: string;
}

// ============================================================
// STUDY SESSIONS
// ============================================================

export interface StudySession {
    id: string;
    started_at: string;
    duration_min: number;
    ended_at?: string;
    set_index: number;
    accuracy: number;
    average_response_time: number;
    longest_focus_streak: number;
    last_seen?: string;
    last_studied?: string;
    user_id: string;
    set_id: string;
    set_type: 'studyset' | 'visualset';
    cards: SessionCard[];
}

export interface SessionCard {
    id: string;
    number: number;
    card_viewcount: number;
    card_total_viewcount: number;
    inQueue: boolean;
    mastered: boolean;
    times_relearned: number;
    card_id: string;
    session_id: string;
    owner_id: string;
}

export interface SessionPin {
    id: string;
    number: number;
    pin_viewcount: number;
    pin_total_viewcount: number;
    inQueue: boolean;
    mastered: boolean;
    times_relearned: number;
    pin_id: string;
    session_id: string;
    owner_id: string;
}

// ============================================================
// SEARCH
// ============================================================

export interface SearchSetResult {
    id: string;
    title: string;
    subject: string;
    last_studied?: string;
    owner: string;
    img_url: string;
    owner_id: string;
    verified: boolean;
    likes: number;
    items: number;
    type: 'studyset' | 'visualset';
}

export interface SearchProfileResult {
    id: string;
    displayName: string;
    img_url: string;
    studoProfile: boolean;
    profileType: string;
    type: 'profile';
}

export interface SearchClassroomResult {
    id: string;
    name: string;
    owner: string;
    owner_id: string;
    type: 'classroom';
    verified: boolean;
}

export interface SearchResults {
    data: [
        { type: 'set'; data: SearchSetResult[] },
        { type: 'profile'; data: SearchProfileResult[] },
        { type: 'classroom'; data: SearchClassroomResult[] }
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
    order?: 'asc' | 'desc';
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
    return 'global_term_language' in set;
}

export function isVisualset(set: Studyset | Visualset): set is Visualset {
    return !('global_term_language' in set);
}

export function isFullStudyset(set: Studyset | FullStudyset): set is FullStudyset {
    return 'cards' in set;
}

export function isFullVisualset(set: Visualset | FullVisualset): set is FullVisualset {
    return 'images' in set;
}

// ============================================================
// UNION TYPES (voor gecombineerde views)
// ============================================================

export type AnySet = Studyset | Visualset;
export type AnyFullSet = FullStudyset | FullVisualset;
export type SetType = 'studyset' | 'visualset';

export interface SetIdentifier {
    id: string;
    type: SetType;
}


// types/next-auth.d.ts

import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// ============================================
// JOUW USER TYPES
// ============================================

export interface UserStats {
    totalsets: number;
    timeLearned: number;
    cardsLearned: number;
}

interface RecentSet {
    set_id: string;
    last_studied: string;
    title: string;
    course: string;
    type: 'studyset' | 'visualset';
    progress: number;
    length: number;
}

export interface StudoUser {
    id: string;
    email: string;
    displayName: string;
    img_url: string;
    join_date: string;
    joinNumber: number;
    totalSets: number;
    streak_count: number;
    streak_last_update: string;
    publicRole: 'owner' | 'admin' | 'user'; // pas aan naar jouw rollen
    verified: boolean;
    stats: UserStats;
    lastTen: RecentSet[];
}

// ============================================
// CHALLENGES
// ============================================

export interface ChallengeResponseDTO {
    challenge_id: string;
    challengeType: 'time attack' | 'mastery tournament' | 'duel';
    start_date: string;
    end_date: string;
    running: boolean;
    title: string;
    set_id: string;
    displayName: string;
    creator_id: string;
    classroom_id: string;
}

export interface ChallengeMemberDTO {
    challenge_id: string;
    user_id: string;
    displayName: string;
    img_url: string;
    classroom_id: string;
    position: number;
    winner: boolean;
}



export interface ProfileDto {
    user_id: string;
    displayName: string;
    img_url: string;
    banner_url: string | null;
    join_date: string;
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
    image: string;
    isDouble: boolean;
}
