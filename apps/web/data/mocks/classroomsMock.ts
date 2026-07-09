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
  ChallengeMemberDTO,
  ChallengeResponseDTO,
} from "../../types/types"; // Adjust import path as needed

// ============================================================
// HELPER DATA
// ============================================================

const userImages = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
];

// ============================================================
// CLASSROOMS
// ============================================================

export const mockClassrooms: Classroom[] = [
  {
    id: "cls_001",
    name: "Nederlands 3de Jaar",
    ownerId: "usr_teacher_001",
    type: "class_group",
    createdAt: "2024-09-01T08:00:00Z",
    verified: true,
    school: "erasmus de pinte",
    public: false,
  },
  {
    id: "cls_002",
    name: "Wiskunde Gevorderden",
    ownerId: "usr_teacher_002",
    type: "community_group",
    createdAt: "2024-09-05T10:30:00Z",
    verified: true,
    school: "UGent",
    public: true,
  },
  {
    id: "cls_003",
    name: "Geschiedenis Studiegroep",
    ownerId: "usr_student_001",
    type: "study_group",
    createdAt: "2024-10-15T14:00:00Z",
    verified: false,
    school: "Don Bosco Zwijnaarde",
    public: false,
  },
  {
    id: "cls_004",
    name: "Engels Conversatie",
    ownerId: "usr_teacher_003",
    type: "class_group",
    createdAt: "2024-09-03T09:15:00Z",
    verified: true,
    school: "Sint Paulus",
    public: false,
  },
  {
    id: "cls_005",
    name: "Biologie Examentraining",
    ownerId: "usr_teacher_001",
    type: "study_group",
    createdAt: "2024-11-01T16:00:00Z",
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
    setId: "set_001",
    setType: "flashcard",
    classroomId: "cls_001",
    addedBy: "usr_teacher_001",
  },
  {
    setId: "set_002",
    setType: "quiz",
    classroomId: "cls_001",
    addedBy: "usr_teacher_001",
  },
  {
    setId: "set_003",
    setType: "flashcard",
    classroomId: "cls_002",
    addedBy: "usr_teacher_002",
  },
  {
    setId: "set_004",
    setType: "vocabulary",
    classroomId: "cls_004",
    addedBy: "usr_teacher_003",
  },
];

export const mockFullClassroomSets: FullClassroomSet[] = [
  {
    setId: "set_001",
    setType: "flashcard",
    classroomId: "cls_001",
    addedBy: "usr_teacher_001",
    title: "Werkwoorden Onvoltooid Verleden Tijd",
    owner: "Mevrouw de Vries",
    createdAt: new Date().toISOString(),
  },
  {
    setId: "set_002",
    setType: "quiz",
    classroomId: "cls_001",
    addedBy: "usr_teacher_001",
    title: "Spelling Moeilijke Woorden",
    owner: "Mevrouw de Vries",
    createdAt: new Date().toISOString(),
  },
  {
    setId: "set_003",
    setType: "flashcard",
    classroomId: "cls_002",
    addedBy: "usr_teacher_002",
    title: "Kwadratische Vergelijkingen",
    owner: "Meneer Jansen",
    createdAt: "2024-09-20T14:00:00Z",
  },
  {
    setId: "set_004",
    setType: "vocabulary",
    classroomId: "cls_004",
    addedBy: "usr_teacher_003",
    title: "Business English Vocabulary",
    owner: "Ms. Thompson",
    createdAt: "2024-10-01T10:00:00Z",
  },
  {
    setId: "set_005",
    setType: "flashcard",
    classroomId: "cls_003",
    addedBy: "usr_student_001",
    title: "WO2 Belangrijke Data",
    owner: "Emma Bakker",
    createdAt: "2024-10-20T15:30:00Z",
  },
  {
    setId: "set_006",
    setType: "quiz",
    classroomId: "cls_005",
    addedBy: "usr_teacher_001",
    title: "Celbiologie Basisconcepten",
    owner: "Mevrouw de Vries",
    createdAt: "2024-11-05T13:00:00Z",
  },
];

// ============================================================
// CLASSROOM USERS
// ============================================================

export const mockClassroomUsers: ClassroomUser[] = [
  // Nederlands 3de Jaar (cls_001)
  {
    userId: "usr_teacher_001",
    classroomId: "cls_001",
    imgUrl: userImages[0],
    role: "teacher",
    joinedAt: "2024-09-01T08:00:00Z",
    displayName: "Mevrouw de Vries",
    streak: 45,
    verified: true,
    position: 1,
  },
  {
    userId: "usr_student_001",
    classroomId: "cls_001",
    imgUrl: userImages[1],
    role: "student",
    joinedAt: "2024-09-02T09:00:00Z",
    displayName: "Emma Bakker",
    streak: 23,
    position: 2,
    verified: true,
  },
  {
    userId: "usr_student_002",
    classroomId: "cls_001",
    imgUrl: userImages[2],
    role: "student",
    joinedAt: "2024-09-02T09:15:00Z",
    displayName: "Lucas van Dam",
    streak: 18,
    position: 3,
    verified: false,
  },
  {
    userId: "usr_student_003",
    classroomId: "cls_001",
    imgUrl: userImages[3],
    role: "student",
    joinedAt: "2024-09-03T10:00:00Z",
    displayName: "Sophie Meijer",
    streak: 31,
    position: 4,
    verified: true,
  },
  {
    userId: "usr_student_004",
    classroomId: "cls_001",
    imgUrl: userImages[4],
    role: "student",
    joinedAt: "2024-09-03T10:30:00Z",
    displayName: "Daan Visser",
    streak: 7,
    verified: false,
    position: 5,
  },

  // Wiskunde Gevorderden (cls_002)
  {
    userId: "usr_teacher_002",
    classroomId: "cls_002",
    imgUrl: userImages[5],
    role: "teacher",
    joinedAt: "2024-09-05T10:30:00Z",
    displayName: "Meneer Jansen",
    streak: 67,
    verified: true,
    position: 3,
  },
  {
    userId: "usr_student_005",
    classroomId: "cls_002",
    imgUrl: userImages[6],
    role: "student",
    joinedAt: "2024-09-06T11:00:00Z",
    displayName: "Tim de Groot",
    streak: 42,
    verified: true,
    position: 1,
  },
  {
    userId: "usr_student_006",
    classroomId: "cls_002",
    imgUrl: userImages[7],
    role: "student",
    joinedAt: "2024-09-06T11:30:00Z",
    displayName: "Lisa Vermeer",
    streak: 55,
    verified: true,
    position: 2,
  },

  // Geschiedenis Studiegroep (cls_003)
  {
    userId: "usr_student_001",
    classroomId: "cls_003",
    imgUrl: userImages[1],
    role: "admin",
    joinedAt: "2024-10-15T14:00:00Z",
    displayName: "Emma Bakker",
    streak: 23,
    verified: true,
    position: 2,
  },
  {
    userId: "usr_student_007",
    classroomId: "cls_003",
    imgUrl: userImages[0],
    role: "member",
    joinedAt: "2024-10-16T15:00:00Z",
    displayName: "Bram Hendriks",
    streak: 12,
    verified: false,
    position: 3,
  },
  {
    userId: "usr_student_008",
    classroomId: "cls_003",
    imgUrl: userImages[3],
    role: "member",
    joinedAt: "2024-10-17T16:00:00Z",
    displayName: "Fleur Smit",
    streak: 8,
    verified: true,
    position: 1,
  },
];

// ============================================================
// FULL CLASSROOMS (with sets and users)
// ============================================================

export const mockFullClassrooms: FullClassroom[] = [
  {
    id: "cls_001",
    name: "Nederlands 3de Jaar",
    ownerId: "usr_teacher_001",
    type: "class_group",
    createdAt: "2024-09-01T08:00:00Z",
    verified: true,
    school: "erasmus de pinte",
    public: false,
    sets: mockFullClassroomSets.filter((s) => s.classroomId === "cls_001"),
    users: mockClassroomUsers.filter((u) => u.classroomId === "cls_001"),
  },
  {
    id: "cls_002",
    name: "Wiskunde Gevorderden",
    ownerId: "usr_teacher_002",
    type: "community_group",
    createdAt: "2024-09-05T10:30:00Z",
    verified: true,
    school: "UGent",
    public: true,
    sets: mockFullClassroomSets.filter((s) => s.classroomId === "cls_002"),
    users: mockClassroomUsers.filter((u) => u.classroomId === "cls_002"),
  },
  {
    id: "cls_003",
    name: "Geschiedenis Studiegroep",
    ownerId: "usr_student_001",
    type: "study_group",
    createdAt: "2024-10-15T14:00:00Z",
    verified: false,
    school: "Don Bosco Zwijnaarde",
    public: false,
    sets: mockFullClassroomSets.filter((s) => s.classroomId === "cls_003"),
    users: mockClassroomUsers.filter((u) => u.classroomId === "cls_003"),
  },
  {
    id: "cls_004",
    name: "Engels Conversatie",
    ownerId: "usr_teacher_003",
    type: "class_group",
    createdAt: "2024-09-03T09:15:00Z",
    verified: true,
    school: "Sint Paulus",
    public: false,
    sets: mockFullClassroomSets.filter((s) => s.classroomId === "cls_004"),
    users: [],
  },
  {
    id: "cls_005",
    name: "Biologie Examentraining",
    ownerId: "usr_teacher_001",
    type: "study_group",
    createdAt: "2024-11-01T16:00:00Z",
    verified: false,
    school: "HOGENT",
    public: false,
    sets: mockFullClassroomSets.filter((s) => s.classroomId === "cls_005"),
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
    .filter((u) => u.userId === userId)
    .map((u) => u.classroomId);
  return mockClassrooms.filter((c) => userClassroomIds.includes(c.id));
};

export const getClassroomsByType = (type: string): Classroom[] => {
  return mockClassrooms.filter((c) => c.type === type);
};

export const getVerifiedClassrooms = (): Classroom[] => {
  return mockClassrooms.filter((c) => c.verified);
};

export const getSetsByClassroomId = (
  classroomId: string,
): FullClassroomSet[] => {
  return mockFullClassroomSets.filter((s) => s.classroomId === classroomId);
};

export const getUsersByClassroomId = (classroomId: string): ClassroomUser[] => {
  return mockClassroomUsers.filter((u) => u.classroomId === classroomId);
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
export const mockChallenges: ChallengeResponseDTO[] = [
  {
    challengeId: "chl_001",
    challengeType: "time attack",
    startDate: "2024-11-01T08:00:00Z",
    endDate: "2024-11-08T08:00:00Z",
    running: false,
    setId: "set_001",
    title: "Werkwoorden Speedrun",
    displayName: "",
    creatorId: "usr_teacher_001",
    classroomId: "cls_001",
  },
  {
    challengeId: "chl_002",
    challengeType: "mastery tournament",
    startDate: "2024-11-10T09:00:00Z",
    endDate: "2024-11-17T09:00:00Z",
    running: false,
    setId: "set_002",
    title: "Spelling Kampioenschap",
    displayName: "",
    creatorId: "usr_teacher_001",
    classroomId: "cls_001",
  },
  {
    challengeId: "chl_003",
    challengeType: "duel",
    startDate: "2024-11-20T14:00:00Z",
    endDate: "2024-11-21T14:00:00Z",
    running: false,
    setId: "set_001",
    title: "Emma vs Lucas Duel",
    displayName: "",
    creatorId: "usr_student_001",
    classroomId: "cls_001",
  },
  {
    challengeId: "chl_004",
    challengeType: "time attack",
    startDate: "2024-11-15T10:00:00Z",
    endDate: "2024-11-22T10:00:00Z",
    running: false,
    setId: "set_003",
    title: "Kwadratische Vergelijkingen Sprint",
    displayName: "",
    creatorId: "usr_teacher_002",
    classroomId: "cls_002",
  },
  {
    challengeId: "chl_005",
    challengeType: "mastery tournament",
    startDate: "2024-12-01T09:00:00Z",
    endDate: "2024-12-08T09:00:00Z",
    running: false,
    setId: "set_003",
    title: "Wiskunde Eindejaarstornooi",
    displayName: "",
    creatorId: "usr_teacher_002",
    classroomId: "cls_002",
  },
  {
    challengeId: "chl_006",
    challengeType: "duel",
    startDate: "2024-12-05T11:00:00Z",
    endDate: "2024-12-06T11:00:00Z",
    running: false,
    setId: "set_005",
    title: "Geschiedenis Duel: WO2",
    displayName: "Geschiedenis Duel: WO2",
    creatorId: "usr_student_001",
    classroomId: "cls_003",
  },
  {
    challengeId: "chl_007",
    challengeType: "time attack",
    startDate: "2024-12-10T08:00:00Z",
    endDate: "2024-12-17T08:00:00Z",
    running: false,
    setId: "set_004",
    title: "Business English Blitz",
    displayName: "",
    creatorId: "usr_teacher_003",
    classroomId: "cls_004",
  },
  {
    challengeId: "chl_008",
    challengeType: "mastery tournament",
    startDate: "2025-01-06T09:00:00Z",
    endDate: "2025-01-13T09:00:00Z",
    running: false,
    setId: "set_006",
    title: "Biologie Examentornooi",
    displayName: "",
    creatorId: "usr_teacher_001",
    classroomId: "cls_005",
  },
  {
    challengeId: "chl_009",
    challengeType: "time attack",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    running: true,
    setId: "set_001",
    title: "November Speedchallenge",
    displayName: "",
    creatorId: "usr_teacher_001",
    classroomId: "cls_001",
  },
  {
    challengeId: "chl_010",
    challengeType: "duel",
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    running: true,
    setId: "set_003",
    title: "Tim vs Lisa: Wiskunde Showdown",
    displayName: "",
    creatorId: "usr_student_005",
    classroomId: "cls_002",
  },
];
export const mockChallengeMembers: ChallengeMemberDTO[] = [
  // chl_001 - time attack cls_001
  {
    challengeId: "chl_001",
    userId: "usr_student_001",
    displayName: "Emma Bakker",
    imgUrl: userImages[1],
    classroomId: "cls_001",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_001",
    userId: "usr_student_003",
    displayName: "Sophie Meijer",
    imgUrl: userImages[3],
    classroomId: "cls_001",
    position: 2,
    winner: false,
  },
  {
    challengeId: "chl_001",
    userId: "usr_student_002",
    displayName: "Lucas van Dam",
    imgUrl: userImages[2],
    classroomId: "cls_001",
    position: 3,
    winner: false,
  },
  {
    challengeId: "chl_001",
    userId: "usr_student_004",
    displayName: "Daan Visser",
    imgUrl: userImages[4],
    classroomId: "cls_001",
    position: 4,
    winner: false,
  },

  // chl_002 - mastery tournament cls_001
  {
    challengeId: "chl_002",
    userId: "usr_student_003",
    displayName: "Sophie Meijer",
    imgUrl: userImages[3],
    classroomId: "cls_001",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_002",
    userId: "usr_student_001",
    displayName: "Emma Bakker",
    imgUrl: userImages[1],
    classroomId: "cls_001",
    position: 2,
    winner: false,
  },
  {
    challengeId: "chl_002",
    userId: "usr_student_004",
    displayName: "Daan Visser",
    imgUrl: userImages[4],
    classroomId: "cls_001",
    position: 3,
    winner: false,
  },
  {
    challengeId: "chl_002",
    userId: "usr_student_002",
    displayName: "Lucas van Dam",
    imgUrl: userImages[2],
    classroomId: "cls_001",
    position: 4,
    winner: false,
  },

  // chl_003 - duel cls_001
  {
    challengeId: "chl_003",
    userId: "usr_student_001",
    displayName: "Emma Bakker",
    imgUrl: userImages[1],
    classroomId: "cls_001",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_003",
    userId: "usr_student_002",
    displayName: "Lucas van Dam",
    imgUrl: userImages[2],
    classroomId: "cls_001",
    position: 2,
    winner: false,
  },

  // chl_004 - time attack cls_002
  {
    challengeId: "chl_004",
    userId: "usr_student_006",
    displayName: "Lisa Vermeer",
    imgUrl: userImages[7],
    classroomId: "cls_002",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_004",
    userId: "usr_student_005",
    displayName: "Tim de Groot",
    imgUrl: userImages[6],
    classroomId: "cls_002",
    position: 2,
    winner: false,
  },

  // chl_005 - mastery tournament cls_002
  {
    challengeId: "chl_005",
    userId: "usr_student_005",
    displayName: "Tim de Groot",
    imgUrl: userImages[6],
    classroomId: "cls_002",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_005",
    userId: "usr_student_006",
    displayName: "Lisa Vermeer",
    imgUrl: userImages[7],
    classroomId: "cls_002",
    position: 2,
    winner: false,
  },

  // chl_006 - duel cls_003
  {
    challengeId: "chl_006",
    userId: "usr_student_007",
    displayName: "Bram Hendriks",
    imgUrl: userImages[0],
    classroomId: "cls_003",
    position: 1,
    winner: true,
  },
  {
    challengeId: "chl_006",
    userId: "usr_student_001",
    displayName: "Emma Bakker",
    imgUrl: userImages[1],
    classroomId: "cls_003",
    position: 2,
    winner: false,
  },

  // chl_009 - running, no winners yet
  {
    challengeId: "chl_009",
    userId: "usr_student_001",
    displayName: "Emma Bakker",
    imgUrl: userImages[1],
    classroomId: "cls_001",
    position: 1,
    winner: false,
  },
  {
    challengeId: "chl_009",
    userId: "usr_student_003",
    displayName: "Sophie Meijer",
    imgUrl: userImages[3],
    classroomId: "cls_001",
    position: 2,
    winner: false,
  },
  {
    challengeId: "chl_009",
    userId: "usr_student_002",
    displayName: "Lucas van Dam",
    imgUrl: userImages[2],
    classroomId: "cls_001",
    position: 3,
    winner: false,
  },
  {
    challengeId: "chl_009",
    userId: "usr_student_004",
    displayName: "Daan Visser",
    imgUrl: userImages[4],
    classroomId: "cls_001",
    position: 4,
    winner: false,
  },

  // chl_010 - running duel, no winner yet
  {
    challengeId: "chl_010",
    userId: "usr_student_005",
    displayName: "Tim de Groot",
    imgUrl: userImages[6],
    classroomId: "cls_002",
    position: 1,
    winner: false,
  },
  {
    challengeId: "chl_010",
    userId: "usr_student_006",
    displayName: "Lisa Vermeer",
    imgUrl: userImages[7],
    classroomId: "cls_002",
    position: 2,
    winner: false,
  },
];
