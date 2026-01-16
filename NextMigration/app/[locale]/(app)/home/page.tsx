"use client";

import { useEffect, useState } from "react";
import {useLocale, useTranslations} from "next-intl";
import TestHomePage from "@/app/[locale]/(app)/home/test";
import AnimateOnMount from "@/components/ui/AnimateOnMount";
import {IoIosArrowForward} from "react-icons/io";
import Link from "next/link";
import {PiMedalLight} from "react-icons/pi";
import {ClassActivity, LastStudied, StartPage, Studyset, User} from "@/lib/types";
import {mockStartPage, mockUser} from "@/data/mocks/startPageMock";
import {Progress} from "@/components/progress/progress";
import CourseIcons from "../../../../data/index.ts";
import {GoPlus} from "react-icons/go";

const user: User = mockUser;
const data: StartPage = mockStartPage;
const colors = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
]
const bgs = [
    "from-amber-500 to-amber-400",
    "from-purple-500 to-purple-400",
    "from-blue-500 to-blue-400",
    "from-emerald-500 to-emerald-400"
]

export default function HomePage() {
    const tTimed = useTranslations("timed");
    const t = useTranslations("home");

    const [welcome] = useState(() => getWelcomeMsg(tTimed, user?.displayName ?? ""));

    const courseSet = new Set(
        data.lastTen.map(set => set.Course)
    );
    const courses = Array.from(courseSet);

    return (
        <div className=" w-full h-full py-15 flex flex-col gap-10 scroll-hidden">
            <section className="w-full h-fit">
                <div className={"w-full h-fit flex flex-col gap-2"}>
                    <span className="font-sfpro font-bold dark:text-white text-studodarkblue text-3xl">
                        {welcome}
                    </span>
                    <span className={"text-studogrey"}>{t("ready")}</span>
                </div>
            </section>

            <section className={"w-full h-fit flex flex-col gap-3"}>
                <div className={"w-full flex flex-row items-center justify-between"}>
                    <span className={"w-full text-lg font-bold dark:text-white/75 text-studodarkblue"}>{t("stats")}:</span>
                    <Link href={"/account"} className={"w-1/2 flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30"}>
                        {t("checkStats")}
                        <IoIosArrowForward />
                    </Link>
                </div>
                <div className={"w-full h-fit grid grid-cols-4 gap-5 grid-rows-1"}>
                    <Stats
                        color={"from-orange-500/20 to-orange-600/20"}
                        icon={<img src={"/icons/streak.svg"} className={"h-5"}/>}
                        stat={10}
                        measurement={"days"}
                        label={"Streak"}
                        extra={""}
                        delay={100}
                    />
                    <Stats
                        color={"from-purple-500/20 to-purple-500/20"}
                        icon={<img src={"/icons/studyset.svg"} className={"invert brightness-0  opacity-30 h-5"}/>}
                        stat={830}
                        measurement={"cards"}
                        label={"totCards"}
                        extra={""}
                        delay={200}
                    />
                    <Stats
                        color={"from-blue-500/20 to-blue-500/20"}
                        icon={<img src={"/icons/clock.svg"} className={"invert brightness-0  opacity-30 h-5"}/>}
                        stat={123}
                        measurement={"min"}
                        label={"tmStd"}
                        extra={"week"}
                        delay={300}
                    />
                    <Stats
                        color={"from-emerald-500/20 to-emerald-600/20"}
                        icon={<PiMedalLight size={20} color={"white"} opacity={0.5} />}
                        stat={645}
                        measurement={"cards"}
                        label={"mastered"}
                        extra={""}
                        delay={400}
                    />

                </div>
            </section>

            <section className={"w-full h-fit flex flex-col gap-3"}>
                <div className={"w-full flex flex-row items-center justify-between"}>
                    <span className={"w-full text-lg font-bold dark:text-white/75 text-studodarkblue"}>{t("Continue")}:</span>
                    <Link href={"/your-files/sets"} className={"w-1/2 flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30"}>
                        {t("checkAll")}
                        <IoIosArrowForward />
                    </Link>
                </div>
                <div className={"w-full grid h-50 grid-cols-4 gap-5 grid-rows-1"}>
                    {data.lastTen.map((set, i) => {
                        return <SetItem
                            index={i}
                            key={i}
                            set={set}
                            delay={i * 50}
                        />
                    })}
                    {data.lastTen.length === 0 && <div className={"w-full h-full flex items-center justify-center"}>{t("no_sets")}</div>}
                </div>
            </section>

            <div className={"w-full h-fit flex flex-row gap-10"}>
                <section className={"w-2/3 h-fit flex flex-col gap-3"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <span className={"w-full text-lg font-bold dark:text-white/75 text-studodarkblue"}>{t("courses")}:</span>
                        <Link href={"/your-files/sets"} className={"w-full justify-end flex flex-row items-center gap-2 text-studodarkblue dark:text-white opacity-30"}>
                            {t("checkCourse")}
                            <IoIosArrowForward />
                        </Link>
                    </div>
                    <div className="w-full grid grid-cols-4 gap-5 h-full">
                        {courses.map((course, i) => (
                            <CourseCard
                                key={i}
                                index={i}
                                course={course}
                            />
                        ))}
                    </div>
                </section>
                <section className={"w-1/3 h-fit flex flex-col gap-3"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <span className={"w-full text-lg font-bold dark:text-white/75 text-studodarkblue"}>{t("act")}:</span>
                        <Link href={"/your-files/sets"} className={"w-full flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30"}>
                            {t("CheckAct")}
                            <IoIosArrowForward />
                        </Link>
                    </div>
                    <div className={"w-full h-fit grid grid-cols-1 gap-5 grid-rows-4"}>
                        {data.class.map((item, i) =>
                        {return <AnimateOnMount key={i} delay={i * 150}>
                            <ActivityItem index={i} activity={item}/>
                        </AnimateOnMount> } )}
                    </div>

                </section>
            </div>

            {<section className={"w-full h-fit flex items-end justify-center"}>
                <AnimateOnMount delay={500}>
                <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 border border-studoborder/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{t("ready")}</h3>
                            <p className="text-studogrey text-sm">{t("create_block")}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/create-studoset"
                                className="px-5 py-2.5 min-w-30 rounded-xl text-sm  bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
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
                </AnimateOnMount>
            </section>}
        </div>
    );
}

function getWelcomeMsg(t: any, name: string): string {
    const time = new Date().getHours();

    const ranges = [
        { from: 0,  to: 1,  key: "0" },   // 00:00 - 01:59
        { from: 2,  to: 3,  key: "2" },   // 02:00 - 03:59
        { from: 4,  to: 6,  key: "4" },   // 04:00 - 06:59
        { from: 7,  to: 10, key: "7" },   // 07:00 - 10:59
        { from: 11, to: 14, key: "11" },  // 11:00 - 14:59
        { from: 15, to: 18, key: "15" },  // 15:00 - 18:59
        { from: 19, to: 21, key: "19" },  // 19:00 - 21:59
        { from: 22, to: 23, key: "22" },  // 22:00 - 23:59
    ];

    const match = ranges.find(r => time >= r.from && time <= r.to);

    if (!match) return `Welcome back, ${name}`;

    try {
        const messages = t.raw(match.key) as string[];
        const message = messages[Math.floor(Math.random() * messages.length)];
        return message.replace("{name}", name);
    } catch {
        return `Welcome back, ${name}`;
    }
}

interface statsProps {
            color: string;
            icon: React.ComponentType<any>;
            stat: number;
            label: string;
            measurement: string;
            extra: string;
            delay: number;

}

function Stats({color, icon, label, stat, measurement, extra, delay}: statsProps) {
    const t = useTranslations("home")
    return (<AnimateOnMount delay={delay}>
        <div className={`w-full h-35 border shadow-2xl backdrop-blur-2xl bg-linear-to-r ${color} 
                        border-studoborder/30 rounded-3xl flex flex-col gap-3 p-3 px-5`}>
        <span className={"w-full h-8 text-sm flex gap-2 text-studogrey items-center "}>
            {icon} {t(label)}
        </span>
        <div className={"w-full flex flex-col gap-1"}>
            <div className={"w-full flex flex-row gap-2"}>
                <span className={"text-white text-3xl font-bold"}>{stat}</span>
                <span className={"h-full flex items-end pb-1 text-sm text-studogrey "}>{t(measurement)}</span>
            </div>
            <span className={"w-full text-studogrey text-xs"}>{extra != "" && t(extra)}</span>
        </div>
    </div>
    </AnimateOnMount>)
}

interface SetProps {
    color: string;
    icon: React.ComponentType<any>;
    stat: number;
    label: string;
    measurement: string;
    extra: string;
    delay: number;

}

interface SetCardProps {
    set: LastStudied;
    delay: number;
    index: number;

}

function SetItem({ set, delay, index}: SetCardProps) {
    const t = useTranslations("home")
    const lang = useLocale();
    const date = new Date(set.last_studied).toLocaleDateString(lang);
    return (
        <AnimateOnMount delay={delay}>
            <Link
                href={`/set/${set.set_id}`}
                className="flex flex-col gap-3 shadow-2xl justify-baseline items-baseline w-full h-50 rounded-2xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden"
            >
                <div className={`h-0.5  w-full mb-3 bg-linear-to-r ${colors[index]}`}></div>
                <div className={"w-full h-full px-7 flex flex-col gap-3 "}>
                <div className={"w-full flex flex-col justify-center gap-2"}>
                    <div className={"w-full h-full flex items-center justify-center"}>
                        <Progress
                            length={set.length}
                            progress={set.progress}
                        />
                    </div>
                    <div className={"w-full flex justify-center flex-row gap-3"}>
                        <span className={"w-fit text-studogrey text-sm"}>{set.progress}% {t("studied")}</span>
                    </div>
                </div>
                <div className={"w-full flex flex-row gap-3 h-fit items-center"}>
                    <img src={set.type = "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg"} className="invert opacity-50 brightness-0 w-5"/>
                    <span className="w-full dark:text-white text-studodarkblue h-fit inline-block align-middle font-bold text-base overflow-hidden truncate">
                      {set.title}
                    </span>
                </div>
                <div className={"w-full h-fit flex flex-row justify-between"}>
                    <span className={"w-fit text-studogrey text-sm"}>{date}</span>
                    <span className={"w-fit text-studogrey text-sm"}>{set.length} {set.type = "studyset" ? t("cards") : t("pins")}</span>
                </div>
                </div>
            </Link>
        </AnimateOnMount>
    )
}

interface CourseCardProps {
    course: string;
    index: number
}

function CourseCard({ course, index }: CourseCardProps) {
    return (
        <Link
            href={`/course/${course}`}
            className="group p-5 shadow-2xl rounded-2xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 text-center"
        >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full shadow-2xl bg-gradient-to-br from-gray-200/10 to-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                <img src={getCoverImage({course})} alt="" className={"w-7 shadow-2xl"}/>
            </div>
            <h3 className="font-medium text-white mb-1">{course}</h3>
        </Link>
    );
}

interface getImageProps {
    course: string;
}

function getCoverImage({course}: getImageProps) {
    const Import = Object.keys(CourseIcons).find((key) =>
        course.toLowerCase().includes(key)
    );
    if (!Import) {
        return "/icons/courses/default.svg";
    }
    return "/icons/courses/" + CourseIcons[Import];
}

interface ActivityItemProps {
    activity: ClassActivity;
    index: number;
}

function ActivityItem({ activity, index}: ActivityItemProps) {
    const timeAgo = getTimeAgo(activity.last_seen);

    return (
        <Link
            href={`/set/${activity.set_id}/${activity.set_type}`}
            className="flex items-center shadow-2xl gap-4 p-4 rounded-xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all"
        >
            {/* Profielfoto */}
            <img
                src={activity.img_url}
                alt={activity.displayName}
                className="w-10 h-10 rounded-full border border-studoborder object-cover"
            />

            {/* Naam + set titel */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{activity.displayName}</h3>
                <div className="flex flex-row items-center gap-2">
                    <img src={activity.set_type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg"} alt="" className={"w-4 invert brightness-0 opacity-30"}/>
                    <p className="text-studogrey text-sm truncate">{activity.title}</p>
                </div>
            </div>

            {/* Tijd + type badge */}
            <div className="flex flex-col items-baseline gap-1">
                <span className="text-white/54 text-xs">{timeAgo}</span>

            </div>
        </Link>
    );
}

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Zojuist';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}u`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
}