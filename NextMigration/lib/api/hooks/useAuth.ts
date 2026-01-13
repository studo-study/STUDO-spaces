// lib/api/hooks/useAuth.ts
// Auth-specifieke mutations

import { useMutation, useQueryClient } from 'react-query';
import { api } from '../client';
import { queryKeys } from '../keys';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    displayname: string;
}

interface AuthResponse {
    token: string;
}

// POST /sessions (login)
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            api.post<AuthResponse>('/sessions', credentials),

        onSuccess: () => {
            // Clear alle cached data bij nieuwe login
            queryClient.clear();
        },
    });
}

// POST /users (register)
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterData) => api.post<AuthResponse>('/users', data),

        onSuccess: () => {
            queryClient.clear();
        },
    });
}

// Logout helper (geen API call nodig)
export function useLogout() {
    const queryClient = useQueryClient();

    return () => {
        // Clear token
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Clear alle cached data
        queryClient.clear();

        // Redirect
        window.location.href = '/login';
    };
}