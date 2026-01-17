
import {ReactNode} from "react";
import LandingHeader from "@/components/marketing/landing_header/header";
import LandingFooter from "@/components/marketing/landing_footer/footer";
import DashboardHeader from "@/components/dashboard/dashboard_header/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (<div className={"flex flex-row w-screen bg-gray-950/50 h-screen"}>
        <DashboardHeader />
        <main className={"w-full max-h-screen overflow-y-scroll bg-gray-950/50"}>{children}</main>
    </div>);
}