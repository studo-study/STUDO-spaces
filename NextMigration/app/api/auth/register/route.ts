import { NextRequest, NextResponse } from 'next/server';
import { registerSchemaBase } from '@/lib/validations/auth';  // ← Base schema
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    console.log('🚀 Register API route hit!');

    try {
        const body = await request.json();
        console.log('📦 Received body:', body);

        // Haal confirmPassword eruit
        const { confirmPassword, ...dataForBackend } = body;

        // Valideer met base schema (zonder refinement)
        const validatedData = registerSchemaBase.parse(dataForBackend);
        console.log('✅ Validated data:', validatedData);

        console.log('🌐 Sending to:', `${process.env.AUTH_API_URL}/users`);

        const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        });

        const responseText = await response.text();
        console.log('📥 NestJS status:', response.status);
        console.log('📥 NestJS response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                { success: false, message: responseText || 'Server error' },
                { status: response.status }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Registratie mislukt' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Account aangemaakt', userId: data.id },
            { status: 201 }
        );

    } catch (error) {
        console.error('❌ Error:', error);

        if (error instanceof ZodError) {
            console.error('❌ Zod errors:', error.flatten().fieldErrors);
            return NextResponse.json(
                { success: false, message: 'Validatiefout', errors: error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Er ging iets mis' },
            { status: 500 }
        );
    }
}