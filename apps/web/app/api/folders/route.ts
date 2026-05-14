import { auth } from "@/auth";
import {NextResponse} from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/folders/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${session.accessToken}`,
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}