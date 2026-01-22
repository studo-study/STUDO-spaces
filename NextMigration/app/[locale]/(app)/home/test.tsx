"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GoFlame, GoGraph, GoBook, GoPlus, GoClock, GoTrophy, GoArrowRight } from "react-icons/go";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiLightningFill, PiBookOpenText, PiCards, PiBrain } from "react-icons/pi";
import { IoPlayCircle } from "react-icons/io5";

// Mock data - vervang met echte data
const mockUser = {
    displayName: "Studo Admin",
    streak: 29,
    totalCards: 847,
    studyTime: 124, // minuten deze week
    masteredCards: 312,
};

const mockRecentSets = [
    { id: 1, title: "Biologie Hoofdstuk 5", cards: 45, progress: 78, color: "from-emerald-500 to-teal-600", lastStudied: "2 uur geleden" },
    { id: 2, title: "Franse Vocabulaire", cards: 120, progress: 34, color: "from-blue-500 to-indigo-600", lastStudied: "Gisteren" },
    { id: 3, title: "Geschiedenis WOII", cards: 67, progress: 92, color: "from-amber-500 to-orange-600", lastStudied: "3 dagen geleden" },
    { id: 4, title: "Wiskunde Formules", cards: 28, progress: 56, color: "from-rose-500 to-pink-600", lastStudied: "1 week geleden" },
];

const mockCourses = [
    { id: 1, title: "Biologie", sets: 8, progress: 67, icon: "🧬" },
    { id: 2, title: "Frans", sets: 12, progress: 45, icon: "🇫🇷" },
    { id: 3, title: "Geschiedenis", sets: 5, progress: 89, icon: "📜" },
];

const studyModes = [
    { id: "flashcards", title: "Flashcards", icon: <PiCards className="text-2xl" />, color: "from-violet-500 to-purple-600", description: "Klassieke kaarten" },
    { id: "write", title: "Schrijven", icon: <PiBookOpenText className="text-2xl" />, color: "from-sky-500 to-blue-600", description: "Typ je antwoorden" },
    { id: "learn", title: "Leren", icon: <PiBrain className="text-2xl" />, color: "from-emerald-500 to-green-600", description: "Adaptief leren" },
    { id: "test", title: "Toets", icon: <GoTrophy className="text-2xl" />, color: "from-amber-500 to-yellow-600", description: "Test jezelf" },
];

export default function TestHomePage() {
    const [hoveredSet, setHoveredSet] = useState<number | null>(null);

    return (
        <div className="min-h-full w-full p-8 pb-20 overflow-y-auto">
            {/* Welcome Section */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                        Welkom terug, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{mockUser.displayName.split(' ')[0]}</span>
                    </h1>
                    <HiOutlineSparkles className="text-2xl text-amber-400 animate-pulse" />
                </div>
                <p className="text-studogrey/70">Klaar om verder te studeren? Je bent op een roll!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                    icon={<GoFlame className="text-2xl text-orange-400" />}
                    title="Streak"
                    value={mockUser.streak}
                    suffix="dagen"
                    gradient="from-orange-500/20 to-amber-500/20"
                    border="border-orange-500/30"
                />
                <StatCard
                    icon={<PiCards className="text-2xl text-violet-400" />}
                    title="Totale kaarten"
                    value={mockUser.totalCards}
                    gradient="from-violet-500/20 to-purple-500/20"
                    border="border-violet-500/30"
                />
                <StatCard
                    icon={<GoClock className="text-2xl text-sky-400" />}
                    title="Studietijd"
                    value={mockUser.studyTime}
                    suffix="min"
                    subtext="deze week"
                    gradient="from-sky-500/20 to-blue-500/20"
                    border="border-sky-500/30"
                />
                <StatCard
                    icon={<GoTrophy className="text-2xl text-emerald-400" />}
                    title="Beheerst"
                    value={mockUser.masteredCards}
                    suffix="kaarten"
                    gradient="from-emerald-500/20 to-teal-500/20"
                    border="border-emerald-500/30"
                />
            </div>

            {/* Continue Studying Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <PiLightningFill className="text-amber-400" />
                        Ga verder met studeren
                    </h2>
                    <Link href="/your-files/sets" className="text-sm text-studogrey/70 hover:text-white transition-colors flex items-center gap-1">
                        Bekijk alles <GoArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockRecentSets.map((set) => (
                        <SetCard
                            key={set.id}
                            set={set}
                            isHovered={hoveredSet === set.id}
                            onHover={() => setHoveredSet(set.id)}
                            onLeave={() => setHoveredSet(null)}
                        />
                    ))}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Study Modes */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                        <GoBook className="text-emerald-400" />
                        Leermodi
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {studyModes.map((mode) => (
                            <StudyModeCard key={mode.id} mode={mode} />
                        ))}
                    </div>
                </div>

                {/* Courses */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <GoGraph className="text-blue-400" />
                            Vakken
                        </h2>
                        <Link href="/your-files/courses" className="text-sm text-studogrey/70 hover:text-white transition-colors">
                            Alles
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {mockCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                        <Link
                            href="/create-course"
                            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-studogrey/30 text-studogrey/50 hover:text-white hover:border-studogrey/50 transition-all"
                        >
                            <GoPlus />
                            <span>Nieuw vak toevoegen</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Klaar om iets nieuws te leren?</h3>
                        <p className="text-studogrey/70 text-sm">Maak een nieuwe studyset of importeer uit je bestanden.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/create-set"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <GoPlus /> Nieuwe set
                        </Link>
                        <Link
                            href="/import"
                            className="px-5 py-2.5 rounded-xl bg-studogrey/20 text-white font-medium hover:bg-studogrey/30 transition-colors border border-studogrey/30"
                        >
                            Importeren
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    suffix?: string;
    subtext?: string;
    gradient: string;
    border: string;
}

function StatCard({ icon, title, value, suffix, subtext, gradient, border }: StatCardProps) {
    return (
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <span className="text-studogrey/70 text-sm">{title}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{value}</span>
                {suffix && <span className="text-studogrey/70 text-sm">{suffix}</span>}
            </div>
            {subtext && <span className="text-studogrey/50 text-xs">{subtext}</span>}
        </div>
    );
}

// Set Card Component
interface SetCardProps {
    set: typeof mockRecentSets[0];
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}

function SetCard({ set, isHovered, onHover, onLeave }: SetCardProps) {
    return (
        <Link
            href={`/set/${set.id}`}
            className="group relative p-5 rounded-2xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${set.color}`} />

            {/* Play button on hover */}
            <div className={`absolute top-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <IoPlayCircle className="text-3xl text-white/80" />
            </div>

            <h3 className="font-semibold text-white mb-2 pr-8">{set.title}</h3>
            <p className="text-studogrey/50 text-sm mb-4">{set.cards} kaarten</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-studogrey/20 rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full bg-gradient-to-r ${set.color} rounded-full transition-all duration-500`}
                    style={{ width: `${set.progress}%` }}
                />
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-studogrey/50">{set.progress}% beheerst</span>
                <span className="text-studogrey/40">{set.lastStudied}</span>
            </div>
        </Link>
    );
}

// Study Mode Card Component
interface StudyModeCardProps {
    mode: typeof studyModes[0];
}

function StudyModeCard({ mode }: StudyModeCardProps) {
    return (
        <Link
            href={`/study/${mode.id}`}
            className="group p-5 rounded-2xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 text-center"
        >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                {mode.icon}
            </div>
            <h3 className="font-medium text-white mb-1">{mode.title}</h3>
            <p className="text-studogrey/50 text-xs">{mode.description}</p>
        </Link>
    );
}

// Course Card Component
interface CourseCardProps {
    course: typeof mockCourses[0];
}

function CourseCard({ course }: CourseCardProps) {
    return (
        <Link
            href={`/course/${course.id}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all"
        >
            <div className="w-10 h-10 rounded-lg bg-studogrey/20 flex items-center justify-center text-xl">
                {course.icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{course.title}</h3>
                <p className="text-studogrey/50 text-sm">{course.sets} sets</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-studogrey/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                    />
                </div>
                <span className="text-studogrey/50 text-xs w-8">{course.progress}%</span>
            </div>
        </Link>
    );
}