import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { user_id: string } }
) {
    const { user_id } = params;

    const res = await fetch(
        `${process.env.AUTH_API_URL}/users/${user_id}/start`,
        {
            headers: {
                Authorization: request.headers.get('Authorization') ?? '',
            },
        }
    );

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch' },
            { status: res.status }
        );
    }

    const data = await res.json();
    return NextResponse.json(data);
}