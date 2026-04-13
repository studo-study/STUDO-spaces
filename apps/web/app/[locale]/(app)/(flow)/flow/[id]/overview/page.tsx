import FlowTable from "@/components/app/flow/page/overview/FlowTable";
import FlowProgress from "@/components/app/flow/page/overview/FlowProgress";
import UrgentPoints from "@/components/app/flow/page/overview/UrgentPoints";
import {auth} from "@/auth";

export default async function Page({params,}: { params: Promise<{ id: string }>; }) {
    const {id} = await params;
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
    return (<div className={"pt-5 flex flex-col gap-5"}>
        {data.total_length !== 0 && data.total_in_progress !== 0 &&
            <FlowProgress
            total_done={data.total_done}
            total_in_progress={data.total_in_progress}
            total_length={data.total_length}
        />}
        <UrgentPoints/>
        <FlowTable data={data.courses}/>
    </div>)
}