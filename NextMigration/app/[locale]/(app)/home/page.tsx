import { useLocale, useTranslations } from "next-intl";
import {Metadata} from "next";
import {auth} from "@/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import SectionHeader from "@/components/app/home/SectionHeader";
import Stats from "@/components/app/home/StatItem";
import SetItem from "@/components/app/home/SetItem";
import CourseCard from "@/components/app/home/CourseCard";
import ActivityItem from "@/components/app/home/ActivityItem";
import CTABlock from "@/components/app/home/CTABlock";



export const metadata:Metadata = {
    title:"Home | Studo"
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
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());

    console.log(data);
    const welcome = getWelcomeMsg(tTimed, session?.user?.displayName ?? '');


    const STATS_CONFIG = [
        { color: "dark:from-orange-500/20 dark:to-orange-600/20 from-orange-400 to-orange-500", icon: "/icons/streak.svg", stat: session?.user?.streak_count, measurement: "days", label: "Streak", extra: "", delay: 0 },
        { color: "dark:from-purple-500/20 dark:to-purple-400/20 from-purple-500 to-purple-500 ", icon: "/icons/studyset.svg", stat: data?.stats?.totalCards, measurement: "cards", label: "totCards", extra: "", delay: 50, invert: true },
        { color: "dark:from-blue-500/20 dark:to-blue-500/20 from-blue-400 to-blue-500", icon: "/icons/clock.svg", stat: data?.stats?.timeLearned, measurement: "min", label: "tmStd", extra: "week", delay: 100, invert: true },
        { color: "dark:from-emerald-500/20 dark:to-emerald-600/20 from-emerald-400 to-emerald-500", iconComponent: true, stat: data?.stats?.cardsLearned, measurement: "cards", label: "mastered", extra: "", delay: 150 },
    ]


    return (
        <div className="w-full h-full py-15 flex flex-col gap-10 ">
            <section className="w-full h-fit ">
                <div className="w-full h-fit flex flex-col gap-2 ">
                    <span className="font-sfpro font-bold dark:text-white text-studodarkblue text-3xl">
                        {welcome}
                    </span>
                    <span className="dark:text-studogrey text-gray-400">{t("ready")}</span>
                </div>
            </section>

            {/* Stats Section */}
            <section className="w-full h-fit flex flex-col gap-3">
                <SectionHeader
                    title={`${t("stats")}:`}
                    linkText={t("checkStats")}
                    href="/account"
                />
                <div className="w-full h-fit grid grid-cols-4 gap-5 grid-rows-1">
                    {STATS_CONFIG.map((config, i) => (
                        <Stats key={i} {...config} t={t} />
                    ))}
                </div>
            </section>

            {/* Continue Section */}
            <section className="w-full h-fit flex flex-col gap-3">
                <SectionHeader
                    title={`${t("Continue")}:`}
                    linkText={t("checkAll")}
                    href="/your-files/sets"
                />
                <div className="w-full grid h-50 grid-cols-4 gap-5 grid-rows-1">
                    {data?.lastTen?.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            {t("no_sets")}
                        </div>
                    ) : (
                        data?.lastTen?.splice(0,3).map((set, i) => (
                            <SetItem key={set.set_id} set={set} index={i} t={t} locale={locale} />
                        ))
                    )}
                </div>
            </section>

            {/* Courses + Activity */}
            <div className="w-full h-fit flex flex-row gap-10">
                <section className="w-2/3 h-fit flex flex-col gap-3">
                    <SectionHeader
                        title={`${t("courses")}:`}
                        linkText={t("checkCourse")}
                        href="/your-files/sets"
                    />
                    <div className="w-full grid grid-cols-4 gap-5 h-full">
                        {data?.courses?.reverse().splice(0,4).map((course, i) => (
                            <CourseCard key={course} course={course} />
                        ))}
                    </div>
                </section>

                <section className="w-1/3 h-fit flex flex-col gap-3">
                    <SectionHeader
                        title={`${t("act")}:`}
                        linkText={t("CheckAct")}
                        href="/your-files/sets"
                    />
                    <div className="w-full h-fit grid grid-cols-1 gap-5 grid-rows-4">
                        {data?.class?.map((item, i) => (
                            <ActivityItem key={item.set_id} activity={item} />
                        ))}
                    </div>
                </section>
            </div>

            <section className="w-full h-fit flex items-end justify-center">
                <CTABlock t={t} />
            </section>
        </div>
    );
}

function getWelcomeMsg(t: ReturnType<typeof useTranslations>, name: string): string {
    const time = new Date().getHours();
    const ranges = [
        { from: 0, to: 1, key: "0" },
        { from: 2, to: 3, key: "2" },
        { from: 4, to: 6, key: "4" },
        { from: 7, to: 10, key: "7" },
        { from: 11, to: 14, key: "11" },
        { from: 15, to: 18, key: "15" },
        { from: 19, to: 21, key: "19" },
        { from: 22, to: 23, key: "22" },
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

