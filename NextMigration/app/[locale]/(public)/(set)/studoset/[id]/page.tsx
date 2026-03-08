// app/studosets/[id]/page.tsx
import { auth } from '@/auth'
import AuthLayout from "@/app/[locale]/(app)/layout";
import StudosetView from "@/app/[locale]/(public)/(set)/studoset/[id]/studosetview";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";

export default async function StudosetPage() {
    const session = await auth()

    if (session) {
        return <AuthLayout><StudosetView /></AuthLayout>
    }
    return <MarketingLayout><StudosetView /></MarketingLayout>
}