import { auth } from "@/auth";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("API route body:", body);

    const response = await fetch(`${process.env.AUTH_API_URL}/studysets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}