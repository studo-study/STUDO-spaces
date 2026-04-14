import FlowTable from "@/components/app/flow/page/overview/FlowTable";
import FlowProgress from "@/components/app/flow/page/overview/FlowProgress";
import UrgentPoints from "@/components/app/flow/page/overview/UrgentPoints";
import {auth} from "@/auth";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";

export default async function Page({params,}: { params: Promise<{ id: string }>; }) {
    const {id} = await params;
    const t = await getTranslations("flow");
    const session = await auth();
    const token = session?.accessToken;
    const res = await fetch(
        `${process.env.AUTH_API_URL}/flows/board/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            method: "GET",
            next: {revalidate: 60},
        }
    );
    const data = await res.json();
    return (<div className={"w-full h-full pt-5  flex flex-col gap-2"}>
        <span className={"text-2x dark:text-white text-studodarkblue font-bold"}>{t("your_courses")}:</span>
        <div className={"flex flex-col gap-5"}>
            {data.total_length !== 0 && data.total_in_progress !== 0 &&
                <FlowProgress
                    total_done={data.total_done}
                    total_in_progress={data.total_in_progress}
                    total_length={data.total_length}
                />}
            <UrgentPoints/>
            <FlowTable data={data.courses}/>
        </div>
    </div>)
}