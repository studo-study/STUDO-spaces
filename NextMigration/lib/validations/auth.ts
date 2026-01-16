import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is verplicht')
        .email('Ongeldig emailadres'),
    password: z
        .string()
        .min(8, 'Wachtwoord moet minimaal 8 karakters zijn')
        .regex(/[A-Z]/, 'Minimaal 1 hoofdletter vereist')
        .regex(/[0-9]/, 'Minimaal 1 cijfer vereist'),
    displayName: z
        .string()
        .min(2, 'Naam moet minimaal 2 karakters zijn')
        .max(50, 'Naam mag maximaal 50 karakters zijn'),
    role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is verplicht').email('Ongeldig emailadres'),
    password: z.string().min(1, 'Wachtwoord is verplicht'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;