// lib/api/hooks/useFolders.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../keys';
import type {
    Folder,
    FullFolder,
    CreateFolder,
    UpdateFolder,
    FolderListResponse,
    SwitchFolderRequest,
} from '../types';

// GET /users/:userId/folders
export function useUserFolders(userId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.folders.byUser(userId!),
        queryFn: () => api.get<FolderListResponse>(`/users/${userId}/folders`),
        enabled: !!userId,
    });
}

// GET /folders/:id
export function useFolder(folderId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.folders.detail(folderId!),
        queryFn: () => api.get<FullFolder>(`/folders/${folderId}`),
        enabled: !!folderId,
    });
}

// POST /folders
export function useCreateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: CreateFolder }) =>
            api.post<Folder>(`/users/${userId}/folders`, data),

        onSuccess: (newFolder, { userId }) => {
            queryClient.setQueryData(
                queryKeys.folders.detail(newFolder.id),
                newFolder
            );
            queryClient.invalidateQueries({
                queryKey: queryKeys.folders.byUser(userId)
            });
        },
    });
}

// PUT /folders/:id
export function useUpdateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ folderId, data }: { folderId: string; data: UpdateFolder }) =>
            api.put<Folder>(`/folders/${folderId}`, data),

        onMutate: async ({ folderId, data }) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.folders.detail(folderId)
            });

            const previousFolder = queryClient.getQueryData<FullFolder>(
                queryKeys.folders.detail(folderId)
            );

            if (previousFolder) {
                queryClient.setQueryData<FullFolder>(
                    queryKeys.folders.detail(folderId),
                    { ...previousFolder, ...data }
                );
            }

            return { previousFolder };
        },

        onError: (err, { folderId }, context) => {
            if (context?.previousFolder) {
                queryClient.setQueryData(
                    queryKeys.folders.detail(folderId),
                    context.previousFolder
                );
            }
        },

        onSettled: (data, error, { folderId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.folders.detail(folderId)
            });
        },
    });
}

// DELETE /folders/:id
export function useDeleteFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderId: string) => api.delete(`/folders/${folderId}`),

        onSuccess: (_, folderId) => {
            queryClient.removeQueries({
                queryKey: queryKeys.folders.detail(folderId)
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
        },
    });
}

// POST /folders/switch (move set to different folder)
export function useSwitchFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SwitchFolderRequest) =>
            api.post('/folders/switch', data),

        onSuccess: (_, { user_id, set_id, destinationFolder_id }) => {
            // Invalidate affected folders and sets
            queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.studysets.byUser(user_id)
            });
        },
    });
}