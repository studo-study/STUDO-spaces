// ============================================================
// MOCK DATA FOR CLASSROOM FRONTEND DEVELOPMENT
// ============================================================

import type {
    Classroom,
    ClassroomSet,
    FullClassroomSet,
    ClassroomUser,
    FullClassroom,
    ClassroomListResponse,
} from '../../types/types'; // Adjust import path as needed

// ============================================================
// HELPER DATA
// ============================================================

const userImages = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
];

// ============================================================
// CLASSROOMS
// ============================================================

export const mockClassrooms: Classroom[] = [
    {
        id: 'cls_001',
        name: 'Nederlands 3de Jaar',
        owner_id: 'usr_teacher_001',
        type: 'class_group',
        created_at: '2024-09-01T08:00:00Z',
        verified: true,
        school: "erasmus de pinte",
        public: false,
    },
    {
        id: 'cls_002',
        name: 'Wiskunde Gevorderden',
        owner_id: 'usr_teacher_002',
        type: 'community_group',
        created_at: '2024-09-05T10:30:00Z',
        verified: true,
        school: "UGent",
        public: true,
    },
    {
        id: 'cls_003',
        name: 'Geschiedenis Studiegroep',
        owner_id: 'usr_student_001',
        type: 'study_group',
        created_at: '2024-10-15T14:00:00Z',
        verified: false,
        school: "Don Bosco Zwijnaarde",
        public: false,
    },
    {
        id: 'cls_004',
        name: 'Engels Conversatie',
        owner_id: 'usr_teacher_003',
        type: 'class_group',
        created_at: '2024-09-03T09:15:00Z',
        verified: true,
        school: "Sint Paulus",
        public: false,
    },
    {
        id: 'cls_005',
        name: 'Biologie Examentraining',
        owner_id: 'usr_teacher_001',
        type: 'study_group',
        created_at: '2024-11-01T16:00:00Z',
        verified: false,
        school: "HOGENT",
        public: false,
    },
];

// ============================================================
// CLASSROOM SETS
// ============================================================

export const mockClassroomSets: ClassroomSet[] = [
    {
        set_id: 'set_001',
        set_type: 'flashcard',
        classroom_id: 'cls_001',
        added_by: 'usr_teacher_001',
    },
    {
        set_id: 'set_002',
        set_type: 'quiz',
        classroom_id: 'cls_001',
        added_by: 'usr_teacher_001',
    },
    {
        set_id: 'set_003',
        set_type: 'flashcard',
        classroom_id: 'cls_002',
        added_by: 'usr_teacher_002',
    },
    {
        set_id: 'set_004',
        set_type: 'vocabulary',
        classroom_id: 'cls_004',
        added_by: 'usr_teacher_003',
    },
];

export const mockFullClassroomSets: FullClassroomSet[] = [
    {
        set_id: 'set_001',
        set_type: 'flashcard',
        classroom_id: 'cls_001',
        added_by: 'usr_teacher_001',
        title: 'Werkwoorden Onvoltooid Verleden Tijd',
        course: 'Nederlands',
        owner: 'Mevrouw de Vries',
        created_at: '2024-09-10T11:00:00Z',
    },
    {
        set_id: 'set_002',
        set_type: 'quiz',
        classroom_id: 'cls_001',
        added_by: 'usr_teacher_001',
        title: 'Spelling Moeilijke Woorden',
        course: 'Nederlands',
        owner: 'Mevrouw de Vries',
        created_at: '2024-09-15T09:30:00Z',
    },
    {
        set_id: 'set_003',
        set_type: 'flashcard',
        classroom_id: 'cls_002',
        added_by: 'usr_teacher_002',
        title: 'Kwadratische Vergelijkingen',
        course: 'Wiskunde',
        owner: 'Meneer Jansen',
        created_at: '2024-09-20T14:00:00Z',
    },
    {
        set_id: 'set_004',
        set_type: 'vocabulary',
        classroom_id: 'cls_004',
        added_by: 'usr_teacher_003',
        title: 'Business English Vocabulary',
        course: 'Engels',
        owner: 'Ms. Thompson',
        created_at: '2024-10-01T10:00:00Z',
    },
    {
        set_id: 'set_005',
        set_type: 'flashcard',
        classroom_id: 'cls_003',
        added_by: 'usr_student_001',
        title: 'WO2 Belangrijke Data',
        course: 'Geschiedenis',
        owner: 'Emma Bakker',
        created_at: '2024-10-20T15:30:00Z',
    },
    {
        set_id: 'set_006',
        set_type: 'quiz',
        classroom_id: 'cls_005',
        added_by: 'usr_teacher_001',
        title: 'Celbiologie Basisconcepten',
        course: 'Biologie',
        owner: 'Mevrouw de Vries',
        created_at: '2024-11-05T13:00:00Z',
    },
];

// ============================================================
// CLASSROOM USERS
// ============================================================

export const mockClassroomUsers: ClassroomUser[] = [
    // Nederlands 3de Jaar (cls_001)
    {
        user_id: 'usr_teacher_001',
        classroom_id: 'cls_001',
        img_url: userImages[0],
        role: 'teacher',
        joined_at: '2024-09-01T08:00:00Z',
        displayName: 'Mevrouw de Vries',
        streak: 45,
        verified: true,
    },
    {
        user_id: 'usr_student_001',
        classroom_id: 'cls_001',
        img_url: userImages[1],
        role: 'student',
        joined_at: '2024-09-02T09:00:00Z',
        displayName: 'Emma Bakker',
        streak: 23,
        verified: true,
    },
    {
        user_id: 'usr_student_002',
        classroom_id: 'cls_001',
        img_url: userImages[2],
        role: 'student',
        joined_at: '2024-09-02T09:15:00Z',
        displayName: 'Lucas van Dam',
        streak: 18,
        verified: false,
    },
    {
        user_id: 'usr_student_003',
        classroom_id: 'cls_001',
        img_url: userImages[3],
        role: 'student',
        joined_at: '2024-09-03T10:00:00Z',
        displayName: 'Sophie Meijer',
        streak: 31,
        verified: true,
    },
    {
        user_id: 'usr_student_004',
        classroom_id: 'cls_001',
        img_url: userImages[4],
        role: 'student',
        joined_at: '2024-09-03T10:30:00Z',
        displayName: 'Daan Visser',
        streak: 7,
        verified: false,
    },

    // Wiskunde Gevorderden (cls_002)
    {
        user_id: 'usr_teacher_002',
        classroom_id: 'cls_002',
        img_url: userImages[5],
        role: 'teacher',
        joined_at: '2024-09-05T10:30:00Z',
        displayName: 'Meneer Jansen',
        streak: 67,
        verified: true,
    },
    {
        user_id: 'usr_student_005',
        classroom_id: 'cls_002',
        img_url: userImages[6],
        role: 'student',
        joined_at: '2024-09-06T11:00:00Z',
        displayName: 'Tim de Groot',
        streak: 42,
        verified: true,
    },
    {
        user_id: 'usr_student_006',
        classroom_id: 'cls_002',
        img_url: userImages[7],
        role: 'student',
        joined_at: '2024-09-06T11:30:00Z',
        displayName: 'Lisa Vermeer',
        streak: 55,
        verified: true,
    },

    // Geschiedenis Studiegroep (cls_003)
    {
        user_id: 'usr_student_001',
        classroom_id: 'cls_003',
        img_url: userImages[1],
        role: 'admin',
        joined_at: '2024-10-15T14:00:00Z',
        displayName: 'Emma Bakker',
        streak: 23,
        verified: true,
    },
    {
        user_id: 'usr_student_007',
        classroom_id: 'cls_003',
        img_url: userImages[0],
        role: 'member',
        joined_at: '2024-10-16T15:00:00Z',
        displayName: 'Bram Hendriks',
        streak: 12,
        verified: false,
    },
    {
        user_id: 'usr_student_008',
        classroom_id: 'cls_003',
        img_url: userImages[3],
        role: 'member',
        joined_at: '2024-10-17T16:00:00Z',
        displayName: 'Fleur Smit',
        streak: 8,
        verified: true,
    },
];

// ============================================================
// FULL CLASSROOMS (with sets and users)
// ============================================================

export const mockFullClassrooms: FullClassroom[] = [
    {
        id: 'cls_001',
        name: 'Nederlands 3de Jaar',
        owner_id: 'usr_teacher_001',
        type: 'class_group',
        created_at: '2024-09-01T08:00:00Z',
        verified: true,
        school: "erasmus de pinte",
        public: false,
        sets: mockFullClassroomSets.filter((s) => s.classroom_id === 'cls_001'),
        users: mockClassroomUsers.filter((u) => u.classroom_id === 'cls_001'),
    },
    {
        id: 'cls_002',
        name: 'Wiskunde Gevorderden',
        owner_id: 'usr_teacher_002',
        type: 'community_group',
        created_at: '2024-09-05T10:30:00Z',
        verified: true,
        school: "UGent",
        public: true,
        sets: mockFullClassroomSets.filter((s) => s.classroom_id === 'cls_002'),
        users: mockClassroomUsers.filter((u) => u.classroom_id === 'cls_002'),
    },
    {
        id: 'cls_003',
        name: 'Geschiedenis Studiegroep',
        owner_id: 'usr_student_001',
        type: 'study_group',
        created_at: '2024-10-15T14:00:00Z',
        verified: false,
        school: "Don Bosco Zwijnaarde",
        public: false,
        sets: mockFullClassroomSets.filter((s) => s.classroom_id === 'cls_003'),
        users: mockClassroomUsers.filter((u) => u.classroom_id === 'cls_003'),
    },
    {
        id: 'cls_004',
        name: 'Engels Conversatie',
        owner_id: 'usr_teacher_003',
        type: 'class_group',
        created_at: '2024-09-03T09:15:00Z',
        verified: true,
        school: "Sint Paulus",
        public: false,
        sets: mockFullClassroomSets.filter((s) => s.classroom_id === 'cls_004'),
        users: [],
    },
    {
        id: 'cls_005',
        name: 'Biologie Examentraining',
        owner_id: 'usr_teacher_001',
        type: 'study_group',
        created_at: '2024-11-01T16:00:00Z',
        verified: false,
        school: "HOGENT",
        public: false,
        sets: mockFullClassroomSets.filter((s) => s.classroom_id === 'cls_005'),
        users: [],
    },
];

// ============================================================
// API RESPONSE MOCKS
// ============================================================

export const mockClassroomListResponse: ClassroomListResponse = {
    classrooms: mockClassrooms,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getClassroomById = (id: string): FullClassroom | undefined => {
    return mockFullClassrooms.find((c) => c.id === id);
};

export const getClassroomsByUserId = (userId: string): Classroom[] => {
    const userClassroomIds = mockClassroomUsers
        .filter((u) => u.user_id === userId)
        .map((u) => u.classroom_id);
    return mockClassrooms.filter((c) => userClassroomIds.includes(c.id));
};

export const getClassroomsByType = (type: string): Classroom[] => {
    return mockClassrooms.filter((c) => c.type === type);
};

export const getVerifiedClassrooms = (): Classroom[] => {
    return mockClassrooms.filter((c) => c.verified);
};

export const getSetsByClassroomId = (classroomId: string): FullClassroomSet[] => {
    return mockFullClassroomSets.filter((s) => s.classroom_id === classroomId);
};

export const getUsersByClassroomId = (classroomId: string): ClassroomUser[] => {
    return mockClassroomUsers.filter((u) => u.classroom_id === classroomId);
};

export const getTopStreakUsers = (limit: number = 5): ClassroomUser[] => {
    return [...mockClassroomUsers]
        .sort((a, b) => b.streak - a.streak)
        .slice(0, limit);
};

// ============================================================
// MOCK API DELAY WRAPPER
// ============================================================

export const withDelay = <T>(data: T, delayMs: number = 500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delayMs);
    });
};

// Usage example:
// const classrooms = await withDelay(mockClassroomListResponse, 800);