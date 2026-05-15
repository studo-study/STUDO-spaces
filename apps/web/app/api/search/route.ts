export async function POST() {
    try {
        return Response.json({ success: true })
    }
    catch (error) {
        console.error(error);
    }
}