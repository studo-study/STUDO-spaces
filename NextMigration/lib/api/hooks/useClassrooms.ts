// lib/api/hooks/useClassrooms.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import type {
    Classroom,
    FullClassroom,
    CreateClassroom,
    UpdateClassroom,
    ClassroomListResponse,
    CreateClassroomUser,
    UpdateClassroomUser,
    CreateClassroomSets,
} from '../types';

// GET /users/:userId/classrooms
export function useUserClassrooms(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.classrooms.byUser(userId!),
        queryFn: () => api.get<ClassroomListResponse>(`/users/${userId}/classrooms`),
        enabled: !!userId,
    });
}

// GET /classrooms/:id
export function useClassroom(classroomId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.classrooms.detail(classroomId!),
        queryFn: () => api.get<FullClassroom>(`/classrooms/${classroomId}`),
        enabled: !!classroomId,
    });
}

// POST /classrooms
export function useCreateClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClassroom) =>
            api.post<Classroom>('/classrooms', data),

        onSuccess: (newClassroom) => {
            queryClient.setQueryData(
                queryKeys.classrooms.detail(newClassroom.id),
                newClassroom
            );
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
        },
    });
}

// PUT /classrooms/:id
export function useUpdateClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         classroomId,
                         data
                     }: {
            classroomId: string;
            data: UpdateClassroom
        }) => api.put<Classroom>(`/classrooms/${classroomId}`, data),

        onMutate: async ({ classroomId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });

            const previousClassroom = queryClient.getQueryData<FullClassroom>(
                queryKeys.classrooms.detail(classroomId)
            );

            if (previousClassroom) {
                queryClient.setQueryData<FullClassroom>(
                    queryKeys.classrooms.detail(classroomId),
                    { ...previousClassroom, ...data }
                );
            }

            return { previousClassroom };
        },

        onError: (err, { classroomId }, context) => {
            if (context?.previousClassroom) {
                queryClient.setQueryData(
                    queryKeys.classrooms.detail(classroomId),
                    context.previousClassroom
                );
            }
        },

        onSettled: (data, error, { classroomId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
        },
    });
}

// DELETE /classrooms/:id
export function useDeleteClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (classroomId: string) =>
            api.delete(`/classrooms/${classroomId}`),

        onSuccess: (_, classroomId) => {
            queryClient.removeQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
        },
    });
}

// POST /classrooms/:id/users (join classroom)
export function useJoinClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         classroomId,
                         data
                     }: {
            classroomId: string;
            data: CreateClassroomUser
        }) => api.post(`/classrooms/${classroomId}/users`, data),

        onSuccess: (_, { classroomId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
        },
    });
}

// DELETE /classrooms/:id/users/:userId (leave classroom)
export function useLeaveClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         classroomId,
                         userId
                     }: {
            classroomId: string;
            userId: string
        }) => api.delete(`/classrooms/${classroomId}/users/${userId}`),

        onSuccess: (_, { classroomId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
        },
    });
}

// POST /classrooms/:id/sets (add sets to classroom)
export function useAddSetsToClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         classroomId,
                         data
                     }: {
            classroomId: string;
            data: CreateClassroomSets
        }) => api.post(`/classrooms/${classroomId}/sets`, data),

        onSuccess: (_, { classroomId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
        },
    });
}

// DELETE /classrooms/:id/sets/:setId
export function useRemoveSetFromClassroom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         classroomId,
                         setId
                     }: {
            classroomId: string;
            setId: string
        }) => api.delete(`/classrooms/${classroomId}/sets/${setId}`),

        onSuccess: (_, { classroomId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.classrooms.detail(classroomId)
            });
        },
    });
}