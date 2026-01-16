// lib/api/hooks/useUser.ts
// User-gerelateerde queries en mutations

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import type { User, UserStats, StartPagina, HeaderInfo } from '../../types';

// GET /users/:id
export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.user.detail(userId!),
        queryFn: () => api.get<User>(`/users/${userId}`),
        enabled: !!userId,
    });
}

// GET /users/:id/stats
export function useUserStats(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.user.stats(userId!),
        queryFn: () => api.get<UserStats>(`/users/${userId}/stats`),
        enabled: !!userId,
    });
}

// GET /users/:id/start
export function useStartPage(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.user.start(userId!),
        queryFn: () => api.get<StartPagina>(`/users/${userId}/start`),
        enabled: !!userId,
        // Start page data is belangrijk, cache wat langer
        staleTime: 10 * 60 * 1000, // 10 minuten
    });
}

// GET /users/:id/headers
export function useUserHeaders(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.user.headers(userId!),
        queryFn: () => api.get<HeaderInfo>(`/users/${userId}/headers`),
        enabled: !!userId,
        // Header info verandert niet vaak
        staleTime: 30 * 60 * 1000, // 30 minuten
    });
}

// PUT /users/:id
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
            api.put<User>(`/users/${userId}`, data),

        // Optimistic update
        onMutate: async ({ userId, data }) => {
            // Cancel lopende queries
            await queryClient.cancelQueries({ queryKey: queryKeys.user.detail(userId) });

            // Snapshot huidige data
            const previousUser = queryClient.getQueryData(queryKeys.user.detail(userId));

            // Optimistic update
            queryClient.setQueryData(queryKeys.user.detail(userId), (old: User | undefined) =>
                old ? { ...old, ...data } : old
            );

            return { previousUser };
        },

        // Rollback bij error
        onError: (err, { userId }, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(queryKeys.user.detail(userId), context.previousUser);
            }
        },

        // Invalidate na success
        onSettled: (data, error, { userId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(userId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.user.headers(userId) });
        },
    });
}

// DELETE /users/:id
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => api.delete(`/users/${userId}`),

        onSuccess: (_, userId) => {
            // Verwijder alle user-gerelateerde cache
            queryClient.removeQueries({ queryKey: queryKeys.user.detail(userId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        },
    });
}