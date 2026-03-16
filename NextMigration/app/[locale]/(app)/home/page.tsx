import { useMemo, memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { PiMedalLight } from "react-icons/pi";
import { ClassActivity, LastStudied, StartPage, User } from "@/types/types";
import { mockStartPage, mockUser } from "@/data/mocks/startPageMock";
import { Progress } from "@/components/marketing/progress/progress";
import CourseIcons from "../../../../data/index";
import { GoPlus } from "react-icons/go";
import {Metadata} from "next";

const user: User = mockUser;
const data: StartPage = mockStartPage;

const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;

const STATS_CONFIG = [
    { color: "dark:from-orange-500/20 dark:to-orange-600/20 from-orange-400 to-orange-500", icon: "/icons/streak.svg", stat: 10, measurement: "days", label: "Streak", extra: "", delay: 0 },
    { color: "dark:from-purple-500/20 dark:to-purple-400 from-purple-500 to-purple-500 ", icon: "/icons/studyset.svg", stat: 830, measurement: "cards", label: "totCards", extra: "", delay: 50, invert: true },
    { color: "dark:from-blue-500/20 dark:to-blue-500/20 from-blue-400 to-blue-500", icon: "/icons/clock.svg", stat: 123, measurement: "min", label: "tmStd", extra: "week", delay: 100, invert: true },
    { color: "dark:from-emerald-500/20 dark:to-emerald-600/20 from-emerald-400 to-emerald-500", iconComponent: true, stat: 645, measurement: "cards", label: "mastered", extra: "", delay: 150 },
] as const;

export const metadata:Metadata = {
    title:"Home | Studo"
}

export default function HomePage() {
    const tTimed = useTranslations("timed");
    const t = useTranslations("home");
    const locale = useLocale();

    // ✅ Memoize berekeningen
    const welcome = useMemo(() => getWelcomeMsg(tTimed, user?.displayName ?? ""), [tTimed, user?.displayName]);

    const courses = useMemo(() => {
        const courseSet = new Set(data.lastTen.map(set => set.Course));
        return Array.from(courseSet);
    }, []);

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
                    {data.lastTen.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            {t("no_sets")}
                        </div>
                    ) : (
                        data.lastTen.map((set, i) => (
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
                        {courses.map((course, i) => (
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
                        {data.class.map((item, i) => (
                            <ActivityItem key={item.set_id} activity={item} />
                        ))}
                    </div>
                </section>
            </div>

            {/* CTA Section */}
            <section className="w-full h-fit flex items-end justify-center">
                <CTABlock t={t} />
            </section>
        </div>
    );
}

// ✅ Memoized sub-components - geen onnodige re-renders

interface SectionHeaderProps {
    title: string;
    linkText: string;
    href: string;
}

const SectionHeader = memo(function SectionHeader({ title, linkText, href }: SectionHeaderProps) {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            <span className="w-full text-lg font-bold dark:text-white/75 text-studodarkblue">{title}</span>
            <Link href={href} className="w-1/2 flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30">
                {linkText}
                <IoIosArrowForward />
            </Link>
        </div>
    );
});

interface StatsProps {
    color: string;
    icon?: string;
    iconComponent?: boolean;
    stat: number;
    label: string;
    measurement: string;
    extra: string;
    invert?: boolean;
    t: ReturnType<typeof useTranslations>;
}

const Stats = memo(function Stats({ color, icon, iconComponent, label, stat, measurement, extra, invert, t }: StatsProps) {
    return (
        <div className={`w-full h-35 border shadow-2xl bg-linear-to-r ${color} 
                        border-studoborder/30 rounded-3xl flex flex-col gap-3 p-3 px-5`}>
            <span className="w-full h-8 text-sm flex gap-2 dark:text-studogrey items-center text-white">
                {iconComponent ? (
                    <PiMedalLight size={20} className="text-white dark:opacity-50" />
                ) : (
                    <img src={icon} className={`h-5 ${invert ? 'invert brightness-0 dark:opacity-30' : ''}`} alt="" />
                )}
                {t(label)}
            </span>
            <div className="w-full flex flex-col gap-1">
                <div className="w-full flex flex-row gap-2">
                    <span className="text-white text-3xl font-bold">{stat}</span>
                    <span className="h-full flex items-end pb-1 text-sm dark:text-studogrey text-white">{t(measurement)}</span>
                </div>
                {extra && <span className="w-full text-white dark:text-studogrey text-xs">{t(extra)}</span>}
            </div>
        </div>
    );
});

interface SetItemProps {
    set: LastStudied;
    index: number;
    t: ReturnType<typeof useTranslations>;
    locale: string;
}

const SetItem = memo(function SetItem({ set, index, t, locale }: SetItemProps) {
    const date = new Date(set.last_studied).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const colorClass = COLORS[index % COLORS.length];

    return (
        <Link
            href={`/set/${set.set_id}`}
            className={`flex flex-col gap-3 shadow-2xl  justify-baseline items-baseline w-full h-50 rounded-2xl bg-white/50
            dark:bg-studogrey/10 border dark:border-studogrey/20 border-gray-200 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
        >
            <div className={`h-0.5 w-full mb-3`} />
            <div className="w-full h-full px-7 flex flex-col gap-3">
                <div className="w-full flex flex-col justify-center gap-2">
                    <div className="w-full h-full flex items-center justify-center">
                        <Progress length={set.length} progress={set.progress} />
                    </div>
                    <div className="w-full flex justify-center flex-row gap-3">
                        <span className="w-fit dark:text-studogrey text-gray-400 text-sm">{set.progress}% {t("studied")}</span>
                    </div>
                </div>
                <div className="w-full flex flex-row gap-3 h-fit items-center">
                    <img src={iconSrc} className="invert opacity-50 brightness-0 w-5" alt="" />
                    <span className="w-full dark:text-white text-studodarkblue h-fit inline-block align-middle font-bold text-base overflow-hidden truncate">
                        {set.title}
                    </span>
                </div>
                <div className="w-full h-fit flex flex-row justify-between">
                    <span className="w-fit dark:text-studogrey text-gray-400 text-sm">{date}</span>
                    <span className="w-fit dark:text-studogrey text-gray-400 text-sm">
                        {set.length} {set.type === "studyset" ? t("cards") : t("pins")}
                    </span>
                </div>
            </div>
        </Link>
    );
});

interface CourseCardProps {
    course: string;
}

const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
    const coverImage = useMemo(() => getCoverImage(course), [course]);

    return (
        <Link
            href={`/course/${course}`}
            className="group p-5 shadow-2xl rounded-2xl bg-white/50 dark:bg-studogrey/10 border dark:border-studogrey/20 border-gray-200 hover:border-studogrey/40 transition-all duration-300 text-center"
        >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full shadow-2xl bg-emerald-300/20 dark:from-gray-200/10 dark:to-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <img src={coverImage} alt="" className="w-7 shadow-2xl" />
            </div>
            <h3 className="font-medium dark:text-white text-studodarkblue mb-1">{course}</h3>
        </Link>
    );
});

interface ActivityItemProps {
    activity: ClassActivity;
}

const ActivityItem = memo(function ActivityItem({ activity }: ActivityItemProps) {
    const timeAgo = useMemo(() => getTimeAgo(activity.last_seen), [activity.last_seen]);
    const iconSrc = activity.set_type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";

    return (
        <Link
            href={`/set/${activity.set_id}/${activity.set_type}`}
            className="flex items-center shadow-2xl gap-4 p-4 rounded-xl dark:bg-studogrey/10 border dark:border-studogrey/20 border-gray-200 bg-white/50 hover:border-studogrey/40 transition-all"
        >
            <img
                src={activity.img_url}
                alt={activity.displayName}
                className="w-10 h-10 rounded-full border border-studoborder object-cover"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-medium dark:text-white text-studodarkblue truncate">{activity.displayName}</h3>
                <div className="flex flex-row items-center gap-2">
                    <img src={iconSrc} alt="" className="w-4 dark:invert brightness-0 dark:opacity-30 opacity-40" />
                    <p className="dark:text-studogrey text-gray-400 text-sm truncate">{activity.title}</p>
                </div>
            </div>
            <div className="flex flex-col items-baseline gap-1">
                <span className="dark:text-white/54 text-gray-400 text-xs">{timeAgo}</span>
            </div>
        </Link>
    );
});

const CTABlock = memo(function CTABlock({ t }: { t: ReturnType<typeof useTranslations> }) {
    return (
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 border border-studoborder/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t("ready")}</h3>
                    <p className="text-studogrey text-sm">{t("create_block")}</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/create-studoset"
                        className="px-5 py-2.5 min-w-30 rounded-xl text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <GoPlus /> {t("create_ss")}
                    </Link>
                    <Link
                        href="/create-visualset"
                        className="px-5 py-2.5 min-w-30 text-sm flex flex-row items-center gap-2 rounded-xl bg-studogrey/20 text-white font-medium hover:bg-studogrey/30 transition-colors border border-studogrey/30"
                    >
                        <GoPlus /> {t("create_vs")}
                    </Link>
                </div>
            </div>
        </div>
    );
});

// ✅ Helper functions BUITEN component
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

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;

    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}

function getTimeAgo(dateString: string): string {
    const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Zojuist';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}u`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return new Date(dateString).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
}
