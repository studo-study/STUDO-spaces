import { useTranslations} from "next-intl";
import {Metadata} from "next";
import {auth} from "@/auth";
import {getTranslations, getLocale} from 'next-intl/server';
import CTABlock from "@/components/ui/app/home/CTABlock";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import JumpBackIn from "@/components/ui/app/home/jump-back-in/JumpBackIn";
import QuickStats from "@/components/ui/app/home/quick_stats/QuickStats";
import YourSets from "@/components/ui/app/home/YourSets/YourSets";
import Courses from "@/components/ui/app/home/Courses/Courses";
import EmptyFallback from "@/components/ui/app/home/EmptyFallback/EmptyFallback";


export const metadata: Metadata = {
    title: "Home | Studo"
}

export default async function HomePage() {
    const t = await getTranslations('home');
    const tTimed = await getTranslations('timed');
    const locale = await getLocale();

    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/users/me/start`,
        {
            headers: {Authorization: `Bearer ${token}`},
            next: {revalidate: 60},
        }
    ).then(res => res.json());

    console.log(data);
    const welcome = getWelcomeMsg(tTimed, session?.user?.displayName ?? '');
    const split = data?.lastTen.toSpliced(3)



    return (
        <PageContainer>
            <section className="w-full h-fit mb-3">
                <div className="w-full h-fit flex flex-col gap-2 ">
                    <span className="font-georgia font-bold dark:text-white text-studodarkblue text-2xl">
                        {welcome}
                    </span>
                    <span className="dark:text-studogrey text-gray-400">{t("ready")}</span>
                </div>
            </section>
            <div className={"w-full grid grid-cols-1 gap-10 pb-40"}>
                <QuickStats stats={data?.stats}/>

                {data?.lastTen && <JumpBackIn items={split ?? []} />}
                {data?.lastTen.length > 0 && <YourSets items={data?.lastTen} />}
                {data?.courses.length > 0 && <Courses items={data?.courses}/>}
                {data?.courses.length === 0 && data?.lastTen.length === 0  && <EmptyFallback/>}
            </div>

            {data?.courses.length === 0 && data?.lastTen.length === 0  &&
            <div className="fixed z-40 bottom-10 w-full h-fit flex items-end justify-center">
                <AnimateOnMount delay={2000}>
                    <CTABlock t={t}/>
                </AnimateOnMount>

            </div>}
           <div className={"fixed z-10 bottom-0 h-25 w-2/3 bg-linear-0 dark:from-bg-dark from-bg-white to-transparent"}/>
        </PageContainer>
    );
}

function getWelcomeMsg(t: ReturnType<typeof useTranslations>, name: string): string {
    const time = new Date().getHours();
    const ranges = [
        {from: 0, to: 1, key: "0"},
        {from: 2, to: 3, key: "2"},
        {from: 4, to: 6, key: "4"},
        {from: 7, to: 10, key: "7"},
        {from: 11, to: 14, key: "11"},
        {from: 15, to: 18, key: "15"},
        {from: 19, to: 21, key: "19"},
        {from: 22, to: 23, key: "22"},
    ];

    const match = ranges.find(r => time >= r.from && time <= r.to);
    if (!match) return `Welcome back, ${name}`;

    try {
        const messages = t.raw(match.key) as string[];
        return messages[Math.floor(Math.random() * messages.length)].replace("{name}", name);
    } catch {
        return `Welcome back, ${name}`;
    }
}

