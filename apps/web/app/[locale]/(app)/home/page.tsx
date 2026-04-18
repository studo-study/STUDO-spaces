import { useTranslations} from "next-intl";
import {Metadata} from "next";
import {auth} from "@/auth";
import {getTranslations, getLocale} from 'next-intl/server';
import CTABlock from "@/components/ui/app/home/CTABlock";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import JumpBackIn from "@/components/ui/app/home/jump-back-in/JumpBackIn";


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


    const STATS_CONFIG = [
        {
            color: "dark:from-orange-500/20 dark:to-orange-600/20 from-orange-400 to-orange-500",
            icon: "/icons/streak.svg",
            stat: session?.user?.streak_count,
            measurement: "days",
            label: "Streak",
            extra: "",
            delay: 0
        },
        {
            color: "dark:from-purple-500/20 dark:to-purple-400/20 from-purple-500 to-purple-500 ",
            icon: "/icons/studyset.svg",
            stat: data?.stats?.totalCards,
            measurement: "cards",
            label: "totCards",
            extra: "",
            delay: 50,
            invert: true
        },
        {
            color: "dark:from-blue-500/20 dark:to-blue-500/20 from-blue-400 to-blue-500",
            icon: "/icons/clock.svg",
            stat: data?.stats?.timeLearned,
            measurement: "min",
            label: "tmStd",
            extra: "week",
            delay: 100,
            invert: true
        },
        {
            color: "dark:from-emerald-500/20 dark:to-emerald-600/20 from-emerald-400 to-emerald-500",
            iconComponent: true,
            stat: data?.stats?.cardsLearned,
            measurement: "cards",
            label: "mastered",
            extra: "",
            delay: 150
        },
    ]


    return (
        <PageContainer>
            <section className="w-full h-fit ">
                <div className="w-full h-fit flex flex-col gap-2 ">
                    <span className="font-georgia font-bold dark:text-white text-studodarkblue text-2xl">
                        {welcome}
                    </span>
                    <span className="dark:text-studogrey font-mono text-gray-400">{t("ready")}</span>
                </div>
            </section>
            <div className={"w-full grid grid-cols-1 gap-5"}>
                <JumpBackIn items={data?.lastTen.splice(0, 2) ?? []} />
            </div>


            {/* Courses + Activity */}


            <div className="fixed bottom-10 w-full h-fit flex items-end justify-center">
                <AnimateOnMount delay={2000}>
                    <CTABlock t={t}/>
                </AnimateOnMount>

            </div>
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

