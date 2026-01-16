import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Valideer input
        const validatedData = registerSchema.parse(body);

        // Stuur naar jouw NestJS backend (zelfde BASE_URL als login)
        const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: validatedData.email,
                password: validatedData.password,
                displayName: validatedData.displayName,
                role: validatedData.role,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Forward NestJS error messages
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || 'Registratie mislukt'
                },
                { status: response.status }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Account succesvol aangemaakt',
                userId: data.id
            },
            { status: 201 }
        );

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validatiefout',
                    errors: error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'Er ging iets mis bij het registreren' },
            { status: 500 }
        );
    }
}