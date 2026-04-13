import FlowTable from "@/components/app/flow/page/overview/FlowTable";
import FlowProgress from "@/components/app/flow/page/overview/FlowProgress";
import UrgentPoints from "@/components/app/flow/page/overview/UrgentPoints";

export default function Page() {
    return (<div className={"pt-5 flex flex-col gap-5"}>
        <FlowProgress/>
        <UrgentPoints/>
        <FlowTable/>
    </div>)
}