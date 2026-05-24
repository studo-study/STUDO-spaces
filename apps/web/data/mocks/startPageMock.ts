import type {
  StartPage,
  LastStudied,
  ClassActivity,
  User,
  UserStats,
  UserWithStats,
  Studyset,
  FullStudyset,
  Card,
  Folder,
} from "../../types/types";

// ============================================================
// MOCK USER
// ============================================================

export const mockUser: User = {
  id: "user-001-uuid-mock",
  email: "charles@studo.app",
  displayName: "Charles De Graeuwe",
  img_url:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  join_date: "2024-03-15T10:30:00.000Z",
  joinNumber: 1247,
  totalSets: 12,
  streak_started: "2026-01-05T00:00:00.000Z",
  streak_count: 7,
  streak_last_update: "2026-01-12T08:30:00.000Z",
  last_login: "2026-01-12T06:45:00.000Z",
  publicRole: "student",
  verified: true,
};

export const mockUserStats: UserStats = {
  totalsets: 12,
  timeLearned: 2450, // minuten
  cardsLearned: 847,
};

export const mockUserWithStats: UserWithStats = {
  ...mockUser,
  stats: mockUserStats,
  lastTen: [], // wordt hieronder gevuld
};

// ============================================================
// MOCK FOLDERS
// ============================================================

export const mockFolders: Folder[] = [
  {
    id: "folder-001-uuid",
    name: "Biologie",
    owner_id: mockUser.id,
  },
  {
    id: "folder-002-uuid",
    name: "Geschiedenis",
    owner_id: mockUser.id,
  },
  {
    id: "folder-003-uuid",
    name: "Talen",
    owner_id: mockUser.id,
  },
];

// ============================================================
// MOCK STUDYSETS (4 stuks)
// ============================================================

export const mockStudysets: Studyset[] = [
  {
    id: "studyset-001-uuid",
    title: "Het Menselijk Hart",
    course: "Biologie",
    global_term_language: "nl",
    global_definition_language: "nl",
    created_at: "2026-01-02T14:30:00.000Z",
    last_updated: "2026-01-10T16:45:00.000Z",
    public_set: true,
    displayName: "Charles De Graeuwe",
    img_url: mockUser.img_url,
    user_id: mockUser.id,
    folder_id: "folder-001-uuid",
  },
  {
    id: "studyset-002-uuid",
    title: "Franse Werkwoorden - Passé Composé",
    course: "Frans",
    global_term_language: "fr",
    global_definition_language: "nl",
    created_at: "2026-01-05T09:15:00.000Z",
    last_updated: "2026-01-11T20:30:00.000Z",
    public_set: true,
    displayName: "Charles De Graeuwe",
    img_url: mockUser.img_url,
    user_id: mockUser.id,
    folder_id: "folder-003-uuid",
  },
  {
    id: "studyset-003-uuid",
    title: "Tweede Wereldoorlog - Belangrijke Data",
    course: "Geschiedenis",
    global_term_language: "nl",
    global_definition_language: "nl",
    created_at: "2025-12-20T11:00:00.000Z",
    last_updated: "2026-01-08T14:20:00.000Z",
    public_set: false,
    displayName: "Charles De Graeuwe",
    img_url: mockUser.img_url,
    user_id: mockUser.id,
    folder_id: "folder-002-uuid",
  },
  {
    id: "studyset-004-uuid",
    title: "Engelse Idiomen",
    course: "Engels",
    global_term_language: "en",
    global_definition_language: "nl",
    created_at: "2026-01-08T16:45:00.000Z",
    last_updated: "2026-01-12T07:30:00.000Z",
    public_set: true,
    displayName: "Charles De Graeuwe",
    img_url: mockUser.img_url,
    user_id: mockUser.id,
    folder_id: "folder-003-uuid",
  },
];

// ============================================================
// MOCK CARDS (voor elke studyset)
// ============================================================

export const mockCardsStudyset1: Card[] = [
  {
    id: "card-001-001",
    term: "Aorta",
    definition:
      "De grootste slagader die zuurstofrijk bloed vanuit het hart naar het lichaam transporteert",
    number: 1,
    created_at: "2026-01-02T14:30:00.000Z",
    updated_at: "2026-01-02T14:30:00.000Z",
    set_id: "studyset-001-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-001-002",
    term: "Ventrikel",
    definition:
      "Hartkamer - de onderste holtes van het hart die bloed wegpompen",
    number: 2,
    created_at: "2026-01-02T14:31:00.000Z",
    updated_at: "2026-01-02T14:31:00.000Z",
    set_id: "studyset-001-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-001-003",
    term: "Atrium",
    definition: "Boezem - de bovenste holtes van het hart die bloed ontvangen",
    number: 3,
    created_at: "2026-01-02T14:32:00.000Z",
    updated_at: "2026-01-02T14:32:00.000Z",
    set_id: "studyset-001-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-001-004",
    term: "Sinusknoop",
    definition:
      "De natuurlijke pacemaker van het hart die elektrische impulsen genereert",
    number: 4,
    created_at: "2026-01-02T14:33:00.000Z",
    updated_at: "2026-01-02T14:33:00.000Z",
    set_id: "studyset-001-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-001-005",
    term: "Mitralisklep",
    definition:
      "Klep tussen linker boezem en linker kamer die terugstroom voorkomt",
    number: 5,
    created_at: "2026-01-02T14:34:00.000Z",
    updated_at: "2026-01-02T14:34:00.000Z",
    set_id: "studyset-001-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
];

export const mockCardsStudyset2: Card[] = [
  {
    id: "card-002-001",
    term: "J'ai mangé",
    definition: "Ik heb gegeten",
    number: 1,
    created_at: "2026-01-05T09:15:00.000Z",
    updated_at: "2026-01-05T09:15:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-002-002",
    term: "Tu as parlé",
    definition: "Jij hebt gesproken",
    number: 2,
    created_at: "2026-01-05T09:16:00.000Z",
    updated_at: "2026-01-05T09:16:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-002-003",
    term: "Elle est allée",
    definition: "Zij is gegaan (vrouwelijk)",
    number: 3,
    created_at: "2026-01-05T09:17:00.000Z",
    updated_at: "2026-01-05T09:17:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-002-004",
    term: "Nous avons fini",
    definition: "Wij hebben afgemaakt",
    number: 4,
    created_at: "2026-01-05T09:18:00.000Z",
    updated_at: "2026-01-05T09:18:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-002-005",
    term: "Ils sont venus",
    definition: "Zij zijn gekomen (mannelijk meervoud)",
    number: 5,
    created_at: "2026-01-05T09:19:00.000Z",
    updated_at: "2026-01-05T09:19:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-002-006",
    term: "Vous avez choisi",
    definition: "U heeft / Jullie hebben gekozen",
    number: 6,
    created_at: "2026-01-05T09:20:00.000Z",
    updated_at: "2026-01-05T09:20:00.000Z",
    set_id: "studyset-002-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
];

export const mockCardsStudyset3: Card[] = [
  {
    id: "card-003-001",
    term: "1 september 1939",
    definition:
      "Begin van de Tweede Wereldoorlog - Duitsland valt Polen binnen",
    number: 1,
    created_at: "2025-12-20T11:00:00.000Z",
    updated_at: "2025-12-20T11:00:00.000Z",
    set_id: "studyset-003-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-003-002",
    term: "6 juni 1944",
    definition: "D-Day - Geallieerde marketing in Normandië",
    number: 2,
    created_at: "2025-12-20T11:01:00.000Z",
    updated_at: "2025-12-20T11:01:00.000Z",
    set_id: "studyset-003-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-003-003",
    term: "8 mei 1945",
    definition: "V-E Day - Einde van de oorlog in Europa",
    number: 3,
    created_at: "2025-12-20T11:02:00.000Z",
    updated_at: "2025-12-20T11:02:00.000Z",
    set_id: "studyset-003-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-003-004",
    term: "7 december 1941",
    definition: "Aanval op Pearl Harbor - VS treedt toe tot de oorlog",
    number: 4,
    created_at: "2025-12-20T11:03:00.000Z",
    updated_at: "2025-12-20T11:03:00.000Z",
    set_id: "studyset-003-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
];

export const mockCardsStudyset4: Card[] = [
  {
    id: "card-004-001",
    term: "Break a leg",
    definition: "Veel succes! (letterlijk: breek een been)",
    number: 1,
    created_at: "2026-01-08T16:45:00.000Z",
    updated_at: "2026-01-08T16:45:00.000Z",
    set_id: "studyset-004-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-004-002",
    term: "Piece of cake",
    definition: "Heel makkelijk (letterlijk: stuk taart)",
    number: 2,
    created_at: "2026-01-08T16:46:00.000Z",
    updated_at: "2026-01-08T16:46:00.000Z",
    set_id: "studyset-004-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-004-003",
    term: "Hit the hay",
    definition: "Gaan slapen (letterlijk: het hooi raken)",
    number: 3,
    created_at: "2026-01-08T16:47:00.000Z",
    updated_at: "2026-01-08T16:47:00.000Z",
    set_id: "studyset-004-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-004-004",
    term: "Spill the beans",
    definition: "Een geheim verklappen (letterlijk: de bonen morsen)",
    number: 4,
    created_at: "2026-01-08T16:48:00.000Z",
    updated_at: "2026-01-08T16:48:00.000Z",
    set_id: "studyset-004-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
  {
    id: "card-004-005",
    term: "Under the weather",
    definition: "Zich niet lekker voelen (letterlijk: onder het weer)",
    number: 5,
    created_at: "2026-01-08T16:49:00.000Z",
    updated_at: "2026-01-08T16:49:00.000Z",
    set_id: "studyset-004-uuid",
    owner_id: mockUser.id,
    term_is_latex: false,
  },
];

// ============================================================
// MOCK FULL STUDYSETS (met cards en likes)
// ============================================================

export const mockFullStudysets: FullStudyset[] = [
  {
    ...mockStudysets[0],
    cards: mockCardsStudyset1,
    likes: [
      {
        id: "like-001",
        user_id: "other-user-001",
        set_id: "studyset-001-uuid",
        set_type: "studyset",
        created_at: "2026-01-05T10:00:00.000Z",
      },
      {
        id: "like-002",
        user_id: "other-user-002",
        set_id: "studyset-001-uuid",
        set_type: "studyset",
        created_at: "2026-01-06T14:30:00.000Z",
      },
    ],
    session: null,
    classrooms: [],
    folders: [mockFolders[0]],
  },
  {
    ...mockStudysets[1],
    cards: mockCardsStudyset2,
    likes: [
      {
        id: "like-003",
        user_id: "other-user-003",
        set_id: "studyset-002-uuid",
        set_type: "studyset",
        created_at: "2026-01-09T08:15:00.000Z",
      },
    ],
    session: null,
    classrooms: [],
    folders: [mockFolders[2]],
  },
  {
    ...mockStudysets[2],
    cards: mockCardsStudyset3,
    likes: [],
    session: null,
    classrooms: [],
    folders: [mockFolders[1]],
  },
  {
    ...mockStudysets[3],
    cards: mockCardsStudyset4,
    likes: [
      {
        id: "like-004",
        user_id: "other-user-001",
        set_id: "studyset-004-uuid",
        set_type: "studyset",
        created_at: "2026-01-10T19:00:00.000Z",
      },
      {
        id: "like-005",
        user_id: "other-user-004",
        set_id: "studyset-004-uuid",
        set_type: "studyset",
        created_at: "2026-01-11T11:45:00.000Z",
      },
      {
        id: "like-006",
        user_id: "other-user-005",
        set_id: "studyset-004-uuid",
        set_type: "studyset",
        created_at: "2026-01-12T06:00:00.000Z",
      },
    ],
    session: null,
    classrooms: [],
    folders: [mockFolders[2]],
  },
];

// ============================================================
// MOCK LAST STUDIED (voor StartPage)
// ============================================================

export const mockLastStudied: LastStudied[] = [
  {
    id: "last-studied-001",
    set_id: "studyset-004-uuid",
    last_studied: "2026-01-12T07:30:00.000Z",
    title: "Engelse Idiomen",
    course: "Engels",
    type: "studyset",
    progress: 60,
    length: 5,
  },
  {
    id: "last-studied-002",
    set_id: "studyset-002-uuid",
    last_studied: "2026-01-11T20:30:00.000Z",
    title: "Franse Werkwoorden - Passé Composé",
    course: "Frans",
    type: "studyset",
    progress: 83,
    length: 6,
  },
  {
    id: "last-studied-003",
    set_id: "studyset-001-uuid",
    last_studied: "2026-01-10T16:45:00.000Z",
    title: "Het Menselijk Hart",
    course: "Biologie",
    type: "studyset",
    progress: 100,
    length: 5,
  },
  {
    id: "last-studied-004",
    set_id: "studyset-003-uuid",
    last_studied: "2026-01-08T14:20:00.000Z",
    title: "Tweede Wereldoorlog - Belangrijke Data",
    course: "Geschiedenis",
    type: "studyset",
    progress: 25,
    length: 4,
  },
];

// ============================================================
// MOCK CLASS ACTIVITIES
// ============================================================

export const mockClassActivities: ClassActivity[] = [
  {
    id: "activity-001",
    classroom_id: "classroom-001-uuid",
    user_id: "other-user-002",
    displayName: "Emma Janssen",
    img_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    set_id: "studyset-001-uuid",
    set_type: "studyset",
    title: "Het Menselijk Hart",
    last_seen: "2026-01-12T05:30:00.000Z",
  },
  {
    id: "activity-002",
    classroom_id: "classroom-001-uuid",
    user_id: "other-user-003",
    displayName: "Lucas Peeters",
    img_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    set_id: "studyset-002-uuid",
    set_type: "studyset",
    title: "Franse Werkwoorden - Passé Composé",
    last_seen: "2026-01-11T22:15:00.000Z",
  },
];

// ============================================================
// MOCK START PAGE (HOOFDOBJECT)
// ============================================================

export const mockStartPage: StartPage = {
  lastTen: mockLastStudied,
  courses: ["Biologie", "Frans", "Geschiedenis", "Engels"],
  class: mockClassActivities,
};

// ============================================================
// MOCK HEADER INFO
// ============================================================

export const mockHeaderInfo = {
  displayName: mockUser.displayName,
  email: mockUser.email,
  streak_count: mockUser.streak_count,
  pfp: mockUser.img_url,
};

// ============================================================
// HELPER: Get mock data by ID
// ============================================================

export function getMockStudysetById(id: string): FullStudyset | undefined {
  return mockFullStudysets.find((set) => set.id === id);
}

export function getMockFolderById(id: string): Folder | undefined {
  return mockFolders.find((folder) => folder.id === id);
}

export function getMockCardById(id: string): Card | undefined {
  const allCards = [
    ...mockCardsStudyset1,
    ...mockCardsStudyset2,
    ...mockCardsStudyset3,
    ...mockCardsStudyset4,
  ];
  return allCards.find((card) => card.id === id);
}

// ============================================================
// EXPORT ALLES
// ============================================================

export const mockData = {
  user: mockUser,
  userStats: mockUserStats,
  userWithStats: mockUserWithStats,
  folders: mockFolders,
  studysets: mockStudysets,
  fullStudysets: mockFullStudysets,
  cards: {
    studyset1: mockCardsStudyset1,
    studyset2: mockCardsStudyset2,
    studyset3: mockCardsStudyset3,
    studyset4: mockCardsStudyset4,
  },
  lastStudied: mockLastStudied,
  classActivities: mockClassActivities,
  startPage: mockStartPage,
  headerInfo: mockHeaderInfo,
};

export default mockData;
