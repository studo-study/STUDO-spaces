// lib/api/client.ts
// Basis API client met token handling

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: HeadersInit;
    cache?: RequestCache;
    tags?: string[];
};

class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: unknown
    ) {
        super(`${status}: ${statusText}`);
        this.name = 'ApiError';
    }
}

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = 'GET', body, headers: customHeaders, cache, tags } = options;

    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
        cache,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    // Next.js specific caching
    if (tags) {
        (config as any).next = { tags };
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 - Token expired
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/login';
        }
        throw new ApiError(401, 'Unauthorized');
    }

    // Handle errors
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};