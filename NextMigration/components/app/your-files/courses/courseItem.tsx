import {memo, useMemo} from "react";
import Link from "next/link";
import CourseIcons from "@/data";

interface CourseCardProps {
    course: string;
}

export default function CourseItem({course}: CourseCardProps) {
    const coverImage = useMemo(() => getCoverImage(course), [course]);

    return (
        <Link
            href={`/course/${course}`}
            className="group p-5 shadow-2xl rounded-2xl bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 text-center"
        >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full shadow-2xl bg-gradient-to-br from-gray-200/10 to-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <img src={coverImage} alt="" className="w-7 shadow-2xl" />
            </div>
            <h3 className="font-medium text-white mb-1">{course}</h3>
        </Link>
    );
};

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;

    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}
