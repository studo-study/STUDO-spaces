// lib/api/keys.ts
// Query keys - centraal beheer voor cache invalidation

export const queryKeys = {
    // User
    user: {
        all: ['user'] as const,
        detail: (id: string) => ['user', id] as const,
        stats: (id: string) => ['user', id, 'stats'] as const,
        start: (id: string) => ['user', id, 'start'] as const,
        headers: (id: string) => ['user', id, 'headers'] as const,
    },

    // Studysets
    studysets: {
        all: ['studysets'] as const,
        list: (filters?: Record<string, unknown>) => ['studysets', 'list', filters] as const,
        detail: (id: string) => ['studysets', id] as const,
        cards: (id: string) => ['studysets', id, 'cards'] as const,
        byUser: (userId: string) => ['studysets', 'user', userId] as const,
    },

    // Visualsets
    visualsets: {
        all: ['visualsets'] as const,
        detail: (id: string) => ['visualsets', id] as const,
        byUser: (userId: string) => ['visualsets', 'user', userId] as const,
    },

    // Folders
    folders: {
        all: ['folders'] as const,
        detail: (id: string) => ['folders', id] as const,
        byUser: (userId: string) => ['folders', 'user', userId] as const,
    },

    // Classrooms
    classrooms: {
        all: ['classrooms'] as const,
        detail: (id: string) => ['classrooms', id] as const,
        byUser: (userId: string) => ['classrooms', 'user', userId] as const,
    },

    // Study sessions
    sessions: {
        all: ['sessions'] as const,
        bySet: (setId: string) => ['sessions', 'set', setId] as const,
        byUser: (userId: string) => ['sessions', 'user', userId] as const,
    },
} as const;