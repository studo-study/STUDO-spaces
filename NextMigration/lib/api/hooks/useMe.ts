// lib/api/hooks/useMe.ts
// Huidige user ophalen via token

import { useQuery } from 'react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import { hasToken } from '@/lib/auth/token';
import type { User } from '../../types';

/**
 * Haalt de huidige ingelogde user op via GET /users/me
 * Alleen actief als er een token aanwezig is
 */
export function useMe() {
    return useQuery({
        queryKey: ['me'] as const,
        queryFn: () => api.get<User>('/users/me'),
        enabled: hasToken(),
        staleTime: 5 * 60 * 1000, // 5 minuten
        retry: (failureCount, error: any) => {
            // Niet retrien bij 401 (invalid token)
            if (error?.status === 401) return false;
            return failureCount < 2;
        },
    });
}