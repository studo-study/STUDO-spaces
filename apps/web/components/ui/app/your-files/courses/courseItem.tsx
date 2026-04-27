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
            className="min-w-35 group p-5 rounded-2xl bg-studogrey/30 border  border-studoborder/30 hover:border-studoborder transition-all duration-300 text-center"
        >
            <div className="min-w-12 min-h-12 w-12 h-12 max-w-12 mx-auto mb-3 rounded-full shadow-2xl flex items-center justify-center text-studodarkblue dark:text-white group-hover:scale-110 transition-transform duration-300">
                <img src={coverImage} alt="" className="w-7 shadow-2xl" />
            </div>
            <h3 className="font-medium dark:text-white text-studodarkblue mb-1">{course}</h3>
        </Link>
    );
};

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;

    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}
