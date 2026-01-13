// lib/api/hooks/useStudysets.ts
// Updated met correcte types

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import type {
    Studyset,
    FullStudyset,
    Card,
    CreateStudyset,
    UpdateStudyset,
    UpdateCard,
    AllSetsResponse,
    StudysetListResponse,
} from '../types';

// GET /users/:userId/about-studosets
export function useUserSets(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.studysets.byUser(userId!),
        queryFn: () => api.get<AllSetsResponse>(`/users/${userId}/about-studosets`),
        enabled: !!userId,
    });
}

// GET /studysets/:id (basic info)
export function useStudyset(setId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.studysets.detail(setId!),
        queryFn: () => api.get<FullStudyset>(`/studysets/${setId}`),
        enabled: !!setId,
    });
}

// POST /studysets
export function useCreateStudyset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStudyset) =>
            api.post<Studyset>('/studysets', data),

        onSuccess: (newSet) => {
            // Update cache
            queryClient.setQueryData(queryKeys.studysets.detail(newSet.id), newSet);

            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryKeys.studysets.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.studysets.byUser(newSet.user_id)
            });
        },
    });
}

// PUT /studysets/:id
export function useUpdateStudyset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ setId, data }: { setId: string; data: UpdateStudyset }) =>
            api.put<Studyset>(`/studysets/${setId}`, data),

        onMutate: async ({ setId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.studysets.detail(setId)
            });

            const previousSet = queryClient.getQueryData<FullStudyset>(
                queryKeys.studysets.detail(setId)
            );

            if (previousSet) {
                queryClient.setQueryData<FullStudyset>(
                    queryKeys.studysets.detail(setId),
                    { ...previousSet, ...data }
                );
            }

            return { previousSet };
        },

        onError: (err, { setId }, context) => {
            if (context?.previousSet) {
                queryClient.setQueryData(
                    queryKeys.studysets.detail(setId),
                    context.previousSet
                );
            }
        },

        onSettled: (data, error, { setId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.studysets.detail(setId)
            });
        },
    });
}

// DELETE /studysets/:id
export function useDeleteStudyset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (setId: string) => api.delete(`/studysets/${setId}`),

        onSuccess: (_, setId) => {
            queryClient.removeQueries({
                queryKey: queryKeys.studysets.detail(setId)
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.studysets.all });
        },
    });
}

// PUT /cards/:id
export function useUpdateCard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         cardId,
                         data
                     }: {
            cardId: string;
            setId: string;
            data: Omit<UpdateCard, 'id'>
        }) => api.put<Card>(`/cards/${cardId}`, data),

        onMutate: async ({ cardId, setId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.studysets.detail(setId)
            });

            const previousSet = queryClient.getQueryData<FullStudyset>(
                queryKeys.studysets.detail(setId)
            );

            if (previousSet) {
                queryClient.setQueryData<FullStudyset>(
                    queryKeys.studysets.detail(setId),
                    {
                        ...previousSet,
                        cards: previousSet.cards.map((card) =>
                            card.id === cardId ? { ...card, ...data } : card
                        ),
                    }
                );
            }

            return { previousSet };
        },

        onError: (err, { setId }, context) => {
            if (context?.previousSet) {
                queryClient.setQueryData(
                    queryKeys.studysets.detail(setId),
                    context.previousSet
                );
            }
        },

        onSettled: (data, error, { setId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.studysets.detail(setId)
            });
        },
    });
}