import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ course_id: string }> }
) {
    const session = await auth();
    const { course_id } = await params;

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/flows/course/${course_id}`, {
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
