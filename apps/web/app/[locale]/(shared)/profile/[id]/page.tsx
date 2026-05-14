// app/studosets/[flow_id]/layout.tsx
import { auth } from '@/auth'
import AuthLayout from "@/app/[locale]/(app)/layout";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";
import ProfileView from "@/app/[locale]/(shared)/profile/[id]/ProfileView";

export default async function ProfilePage({params}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { id } = await params;
    const session = await auth()

    if (session) {
        return <AuthLayout>
            <ProfileView id={id} />
        </AuthLayout>;
    }

    return <MarketingLayout> <ProfileView id={id} /></MarketingLayout>
}