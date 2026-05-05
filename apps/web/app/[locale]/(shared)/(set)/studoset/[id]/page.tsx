// app/studosets/[flow_id]/layout.tsx
import { auth } from '@/auth'
import AuthLayout from "@/app/[locale]/(app)/layout";
import StudosetView from "@/app/[locale]/(shared)/(set)/studoset/[id]/studosetview";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";

export default async function StudosetPage({params}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params;
    const session = await auth()

    if (session) {
        return <>
            <div className="flex w-full h-full max-w-3/4 flex-col gap-3 sm:gap-5">
                <StudosetView id={id} />
            </div>
        </>
    }
    return <MarketingLayout>
        <div className="w-screen mt-10 dark:text-white md:mt-0 min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
            <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-[700px] flex-col items-center justify-center gap-3 sm:gap-5">
                <StudosetView id={id} />
            </div>
        </div>
    </MarketingLayout>
}