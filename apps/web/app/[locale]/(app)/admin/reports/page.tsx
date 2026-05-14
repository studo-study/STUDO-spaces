import {Metadata} from "next";
import TicketingGrid from "@/components/ui/app/admin/reports/TicketingGrid";

export const metadata:Metadata = {
    title:"Admin Dashboard | Studo"
}

export default function ReportsPage() {
    return(<div className={"w-full h-full flex flex-col gap-5"}>
            <TicketingGrid/>
    </div>);
}