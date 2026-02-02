import {ReactNode} from "react";
import AdminHeader from "@/components/dashboard/adminheader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (<div className={"flex flex-row w-screen bg-gray-950/50 h-screen"}>
        <AdminHeader />
        <main className={"w-full max-h-screen overflow-y-scroll bg-gray-950/50"}>{children}</main>
    </div>);
}