import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    try {
        return Response.json({ success: true })
    }
    catch (error) {
        console.error(error);
    }
}