import { CardListResponseDto, CardResponseDto } from '../studyset/card.dto';
import { ClassroomResponseDto } from '../classroom/classroom.dto';
import { StudysetListResponseDto } from '../studyset/studyset.dto';
import { ProfileListResponseDto } from '../profile/profile.dto';
import { PinResponseDto } from '../pin/pin.dto';

export interface User {
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

export interface Profile {
  user_id: string;
  email: string;
  displayName: string;
  img_url: string;
  joinDate: string;
  streak: number;
  joinNumber: number;
}

export interface Studyset {
  id: string;
  title: string;
  subject: string;
  global_term_language: string;
  global_definition_language: string;
  created_at: string;
  last_studied: string;
  last_updated: string;
  publicSet: boolean;
  hearts: number;
  user_id: string;
  folder_id: string;
}

export interface Cards {
  id: string;
  term: string;
  definition: string;
  number: number;
  created_at: string;
  updated_at: string;
  card_viewcount: number;
  card_totalviewcount: number;
  inQueue: boolean;
  mastered: boolean;
  times_relearned: number;
  set_id: string;
  owner_id: string;
}

export interface Visualset {
  id: string;
  title: string;
  subject: string;
  global_term_language: string;
  global_definition_language: string;
  created_at: string;
  last_studied: string;
  last_updated: string;
  publicSet: boolean;
  hearts: number;
  user_id: string;
  folder_id: string;
  grid_x: number;
  grid_y: number;
  scale: number;
}

export interface Pin {
  id: string;
  definition: string;
  x: string;
  y: string;
  number: number;
  created_at: string;
  updated_at: string;
  pin_viewcount: number;
  pin_totalviewcount: number;
  set_id: string;
  owner_id: string;
}

export interface Studysession {
  id: string;
  started_at: string;
  duration: number;
  second_last_login: string;
  last_login: string;
  ended_at: string;
  index: number;
  accuracy: number;
  average_response_time: number;
  longest_focus_streak: number;
  device_type: string;
  last_seen: string;
  user_id: string;
  set_id: string;
}

export interface Folder {
  id: string;
  name: string;
  user_id: string;
}

export interface SetLike {
  id: string;
  user_id: string;
  set_id: string;
  created_at: string;
}

export interface Classroom {
  id: string;
  name: string;
  owner: string;
  type: string;
  created_at: string;
  verified: boolean;
}

export interface ClassroomUser {
  user_id: string;
  classroom_id: string;
  role: string;
}

export interface ClassroomSet {
  set_id: string;
  classroom_id: string;
}

//data
export const USERS: User[] = [
  {
    id: '229c6879-ce55-4e62-9fec-615a17bfb057',
    email: 'charles.degraeuwe@icloud.com',
    password: 'Wachtwoord',
    displayName: 'Charles',
    img_url: '',
    join_date: '24 October 2025 15:51 UTC',
    joinNumber: 1,
    streak_started: null,
    streak_count: null,
    streak_last_update: null,
    last_login: '24 October 2025 16:48 UTC',
    hearts: 0,
    role: 'student',
  },
  {
    id: '4a2b9e11-dc33-45e8-9f77-91ac2b34e9a2',
    email: 'emma.vandenberg@example.com',
    password: 'Wachtwoord',
    displayName: 'Emma',
    img_url: '',
    join_date: '24 September 2025 16:30 UTC',
    joinNumber: 2,
    streak_started: null,
    streak_count: null,
    streak_last_update: null,
    last_login: '31 October 2025 16:42 UTC',
    hearts: 0,
    role: 'student',
  },
  {
    id: '7b3c1d22-af44-4d19-8a88-b2bd4c45f0b3',
    email: 'lucas.peeters@example.com',
    password: 'Wachtwoord',
    displayName: 'Lucas',
    img_url: '',
    join_date: '24 October 2025 16:35 UTC',
    joinNumber: 3,
    streak_started: null,
    streak_count: null,
    streak_last_update: null,
    last_login: '4 August 2025 16:50 UTC',
    hearts: 0,
    role: 'student',
  },
  {
    id: '9c4d2e33-be55-4e2a-9b99-c3ce5d56a1c4',
    email: 'sofie.declercq@example.com',
    password: 'Wachtwoord',
    displayName: 'Sofie',
    img_url: '',
    join_date: '24 October 2025 16:40 UTC',
    joinNumber: 4,
    streak_started: null,
    streak_count: null,
    streak_last_update: null,
    last_login: '13 April 2025 16:55 UTC',
    hearts: 0,
    role: 'student',
  },
];

export const FOLDERS: Folder[] = [
  {
    id: '0b9a3915-4b1e-408d-b6e4-ae30035e4023',
    name: 'folder 1 test',
    user_id: '229c6879-ce55-4e62-9fec-615a17bfb057',
  },
];

export const STUDYSETS: Studyset[] = [
  {
    id: '3d9dd36f-8f2a-48b6-b56a-28afb30fe6c0',
    title: 'Computer Systems termen',
    subject: 'Computer Systems',
    global_term_language: 'en',
    global_definition_language: 'nl',
    created_at: '24 October 2025 16:50 UTC',
    last_studied: '24 October 2025 17:00 UTC',
    last_updated: '24 October 2025 16:50 UTC',
    publicSet: true,
    hearts: 2,
    user_id: '229c6879-ce55-4e62-9fec-615a17bfb057',
    folder_id: '0b9a3915-4b1e-408d-b6e4-ae30035e4023',
  },
];

export const SESSIONS: Studysession[] = [];

export const CARDS: Cards[] = [];

export const CLASSROOMS: Classroom[] = [
  {
    id: '9504e8e1-9683-49bf-99e1-22f4810d6bc3',
    name: '2A2',
    owner: '229c6879-ce55-4e62-9fec-615a17bfb057',
    type: 'classroom',
    created_at: '24 October 2025 19:51 UTC',
    verified: false,
  },
];

export const CLASSROOM_USERS: ClassroomUser[] = [
  {
    user_id: '229c6879-ce55-4e62-9fec-615a17bfb057',
    classroom_id: '9504e8e1-9683-49bf-99e1-22f4810d6bc3',
    role: 'owner', // Charles is eigenaar van het klaslokaal
  },
  {
    user_id: '4a2b9e11-dc33-45e8-9f77-91ac2b34e9a2',
    classroom_id: '9504e8e1-9683-49bf-99e1-22f4810d6bc3',
    role: 'student',
  },
  {
    user_id: '7b3c1d22-af44-4d19-8a88-b2bd4c45f0b3',
    classroom_id: '9504e8e1-9683-49bf-99e1-22f4810d6bc3',
    role: 'student',
  },
];

export const CLASSROOM_SETS: ClassroomSet[] = [
  {
    set_id: '3d9dd36f-8f2a-48b6-b56a-28afb30fe6c0',
    classroom_id: '9504e8e1-9683-49bf-99e1-22f4810d6bc3',
  },
];

export const SET_LIKES: SetLike[] = [];

export const PROFILES: Profile[] = [];

export const VISUALSETS: Visualset[] = [];

export const PINS: Pin[] = [];
