import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        return Response.json({ success: true })
    }
    catch (error) {
        console.error(error);
    }
}