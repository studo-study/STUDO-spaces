// app/studosets/[id]/page.tsx
import { auth } from '@/auth'
import AuthLayout from "@/app/[locale]/(app)/layout";
import StudosetView from "@/app/[locale]/(public)/(set)/studoset/[id]/studosetview";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";
import {ProfileView} from "@/app/[locale]/(public)/profile/[id]/ProfileView";

export default async function ProfilePage() {
    const session = await auth()

    if (session) {
        return <AuthLayout><ProfileView /></AuthLayout>
    }
    return <MarketingLayout><ProfileView /></MarketingLayout>
}