import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ row_id: string }> }
) {
    const session = await auth();
    const { row_id } = await params;

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${process.env.AUTH_API_URL}/flows/row/${row_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ row_id: string }> }
) {
    const session = await auth();
    const { row_id } = await params;

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/flows/row/${row_id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${session.accessToken}`,
        },
    });

    if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}