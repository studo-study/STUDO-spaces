// lib/api/hooks/useVisualsets.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import type {
    Visualset,
    FullVisualset,
    CreateVisualset,
    UpdateVisualset,
    UpdatePin,
    Pin,
} from '../types';

// GET /visualsets/:id
export function useVisualset(setId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.visualsets.detail(setId!),
        queryFn: () => api.get<FullVisualset>(`/visualsets/${setId}`),
        enabled: !!setId,
    });
}

// POST /visualsets
export function useCreateVisualset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisualset) =>
            api.post<Visualset>('/visualsets', data),

        onSuccess: (newSet) => {
            queryClient.setQueryData(queryKeys.visualsets.detail(newSet.id), newSet);
            queryClient.invalidateQueries({ queryKey: queryKeys.visualsets.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.studysets.byUser(newSet.user_id)
            });
        },
    });
}

// PUT /visualsets/:id
export function useUpdateVisualset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ setId, data }: { setId: string; data: UpdateVisualset }) =>
            api.put<Visualset>(`/visualsets/${setId}`, data),

        onMutate: async ({ setId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.visualsets.detail(setId)
            });

            const previousSet = queryClient.getQueryData<FullVisualset>(
                queryKeys.visualsets.detail(setId)
            );

            if (previousSet) {
                queryClient.setQueryData<FullVisualset>(
                    queryKeys.visualsets.detail(setId),
                    { ...previousSet, ...data }
                );
            }

            return { previousSet };
        },

        onError: (err, { setId }, context) => {
            if (context?.previousSet) {
                queryClient.setQueryData(
                    queryKeys.visualsets.detail(setId),
                    context.previousSet
                );
            }
        },

        onSettled: (data, error, { setId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.visualsets.detail(setId)
            });
        },
    });
}

// DELETE /visualsets/:id
export function useDeleteVisualset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (setId: string) => api.delete(`/visualsets/${setId}`),

        onSuccess: (_, setId) => {
            queryClient.removeQueries({
                queryKey: queryKeys.visualsets.detail(setId)
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.visualsets.all });
        },
    });
}

// PUT /pins/:id
export function useUpdatePin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         pinId,
                         data
                     }: {
            pinId: string;
            setId: string;
            imageId: string;
            data: Omit<UpdatePin, 'id'>
        }) => api.put<Pin>(`/pins/${pinId}`, data),

        onMutate: async ({ pinId, setId, imageId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.visualsets.detail(setId)
            });

            const previousSet = queryClient.getQueryData<FullVisualset>(
                queryKeys.visualsets.detail(setId)
            );

            if (previousSet) {
                queryClient.setQueryData<FullVisualset>(
                    queryKeys.visualsets.detail(setId),
                    {
                        ...previousSet,
                        images: previousSet.images.map((image) =>
                            image.id === imageId
                                ? {
                                    ...image,
                                    pins: {
                                        pins: image.pins.pins.map((pin) =>
                                            pin.id === pinId ? { ...pin, ...data } : pin
                                        ),
                                    },
                                }
                                : image
                        ),
                    }
                );
            }

            return { previousSet };
        },

        onError: (err, { setId }, context) => {
            if (context?.previousSet) {
                queryClient.setQueryData(
                    queryKeys.visualsets.detail(setId),
                    context.previousSet
                );
            }
        },

        onSettled: (data, error, { setId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.visualsets.detail(setId)
            });
        },
    });
}