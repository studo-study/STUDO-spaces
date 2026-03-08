import { auth } from '@/auth';
import LandingHeader from '@/components/marketing/landing_header/header';
import LandingFooter from '@/components/marketing/landing_footer/footer';
import AppLayoutClient from '@/components/app/AppLayoutClient';
import ClassroomHeader from '@/components/app/classroom/ClassroomHeader';
import { ReactNode } from 'react';

export default async function ClassroomLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (session) {
        return (
            <AppLayoutClient>
                <div className="w-full h-full py-15 flex flex-col overflow-hidden">
                    <ClassroomHeader />
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
            <main>
                <div className="w-full h-full py-15 flex flex-col overflow-hidden">
                    <ClassroomHeader />
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