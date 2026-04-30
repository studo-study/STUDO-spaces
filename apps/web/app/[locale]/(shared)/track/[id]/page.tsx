
import { auth } from '@/auth'
import AuthLayout from "@/app/[locale]/(app)/layout";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";
import TrackView from "@/app/[locale]/(public)/track/[id]/TrackView";


export default async function TrackPage() {
    const session = await auth()

    if (session) {
        return <AuthLayout><TrackView /></AuthLayout>
    }
    return <MarketingLayout><TrackView /></MarketingLayout>
}