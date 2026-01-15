// lib/api/hooks/useAuth.ts
// Auth-specifieke mutations

import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import { api } from '../client';
import { setToken, removeToken } from '@/lib/auth/token';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    displayName: string;
}

interface AuthResponse {
    token: string;
}

/**
 * POST /sessions (login)
 */
export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            api.post<AuthResponse>('/sessions', credentials),

        onSuccess: (data) => {
            // Token opslaan
            setToken(data.token);

            // Clear oude cached data
            queryClient.clear();

            // Redirect naar home
            router.push('/home');
        },
    });
}

/**
 * POST /users (register)
 */
export function useRegister() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterData) =>
            api.post<AuthResponse>('/users', data),

        onSuccess: (data) => {
            // Token opslaan
            setToken(data.token);

            // Clear cache
            queryClient.clear();

            // Redirect naar home
            router.push('/home');
        },
    });
}

/**
 * Logout - clear token en redirect
 */
export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return () => {
        // Token verwijderen
        removeToken();

        // Clear alle cached data
        queryClient.clear();

        // Redirect naar login
        router.push('/login');
    };
}