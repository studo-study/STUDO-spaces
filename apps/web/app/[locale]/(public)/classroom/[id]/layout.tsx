import { auth } from '@/auth';
import LandingHeader from '@/components/ui/marketing/landing_header/header';
import LandingFooter from '@/components/ui/marketing/landing_footer/footer';
import AppLayoutClient from '@/components/ui/app/AppLayoutClient';
import { ReactNode } from 'react';
import PrivateClassroomHeader from "@/components/ui/app/classroom/PrivateClassroomHeader";
import PublicClassroomHeader from "@/components/ui/app/classroom/PublicClassroomHeader";

export default async function ClassroomLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (session) {
        return (
            <AppLayoutClient>
                <div className="w-full h-full py-15 flex flex-col overflow-hidden">
                    <PrivateClassroomHeader />
                    <div className="w-full flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </AppLayoutClient>
        );
    }

    return (
        <div className="scroll-hidden">
            <LandingHeader />
            <main className={"w-screen h-screen flex items-center justify-center"}>
                <div className="mt-30 w-1/2 h-full py-15 flex flex-col overflow-hidden">
                    <PublicClassroomHeader />
                    <div className="w-full flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </main>
            <div className="absolute z-[999999] w-full h-fit">
                <LandingFooter />
            </div>
        </div>
    );
}