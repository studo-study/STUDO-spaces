import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Fallback - middleware zou dit al moeten afhandelen
export default async function LocalePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
        redirect("/home");
    } else {
        redirect("/welcome");
    }
}