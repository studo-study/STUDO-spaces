import CoursePageHeader from "@/components/app/flow/page/CoursePage/CoursePageHeader";
import {getTranslations} from "next-intl/server";
import {auth} from "@/auth";
import CourseTable from "@/components/app/flow/page/CoursePage/CourseTable";
import {FlowCourseResponse} from "@studo/types";
import CourseItemProgress from "@/components/app/flow/page/overview/CourseItemProgress";
import StateProvider from "@/components/app/flow/page/CoursePage/StateProvider";


export default async function Page({params,}: { params: Promise<{ id: string, course_id: string }>; }) {
    const {course_id} = await params;
    console.log(course_id);
    const t = await getTranslations("flow");
    const session = await auth();
    const token = session?.accessToken;
    const res = await fetch(
        `${process.env.AUTH_API_URL}/flows/course/${course_id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            method: "GET",
            next: {revalidate: 60},
        }
    );

    const data = await res.json();
    console.log(data);
    return (<StateProvider data={data}/>)
}