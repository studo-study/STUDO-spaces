import {Metadata} from "next";
import {useTranslations} from "next-intl";
import CourseItem from "@/components/app/your-files/courses/courseItem";
import {StartPage} from "@/types/types";
import {mockStartPage} from "@/data/mocks/startPageMock";



const data: StartPage = mockStartPage;

export default function Page() {
    const courses: Set<string> = new Set<string>()
    data.lastTen.forEach((item) => {courses.add(item.Course)})

    const t = useTranslations("y_f.courses")
    return (
        <div className=" w-full grid grid-cols-5 gap-5 scroll-hidden py-25">
            {
                [...courses].map((item) => (
                    <CourseItem key={item} course={item} />
                ))
            }

        </div>
    );
}