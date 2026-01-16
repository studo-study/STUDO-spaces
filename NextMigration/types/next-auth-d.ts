// types/next-auth.d.ts

import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// ============================================
// STUDO USER TYPES
// ============================================

interface UserStats {
    totalsets: number;
    timeLearned: number;
    cardsLearned: number;
}

interface RecentSet {
    set_id: string;
    last_studied: string;
    title: string;
    Course: string;
    type: 'studyset' | 'visualset';
    progress: number;
    length: number;
}

interface StudoUser {
    id: string;
    email: string;
    displayName: string;
    img_url: string;
    join_date: string;
    joinNumber: number;
    totalSets: number;
    streak_count: number;
    streak_last_update: string;
    publicRole: 'owner' | 'admin' | 'user';
    verified: boolean;
    stats: UserStats;
    lastTen: RecentSet[];
}

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