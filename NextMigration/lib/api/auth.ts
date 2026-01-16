import type { RegisterFormData } from '@/lib/validations/auth';

interface RegisterResponse {
    success: boolean;
    message: string;
    userId?: string;
    errors?: Record<string, string[]>;
}

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;
}