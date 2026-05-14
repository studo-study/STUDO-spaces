import {Metadata} from "next";
import CourseItem from "@/components/ui/app/your-files/courses/courseItem";
import {auth} from "@/auth";
import {AllsetsResponse} from "@studo/types";


export const metadata: Metadata = {
    title: "courses | Studo"
}

export default async function Page() {
    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/users/me/studosets`,
        {
            headers: {Authorization: `Bearer ${token}`},
            next: {revalidate: 60},
        }
    ).then(res => res.json()) as AllsetsResponse;

    const courses = new Set<string>();
    data.studysets?.forEach((item: { course: string; }) => courses.add(item.course));
    data.visualsets?.forEach((item: { course: string; }) => courses.add(item.course));


    return (
        <div className="w-full grid grid-cols-5 gap-5 scroll-hidden py-5">
            {[...courses].map((item) => (
                <CourseItem key={item} course={item} options/>
            ))}
        </div>
    );
}