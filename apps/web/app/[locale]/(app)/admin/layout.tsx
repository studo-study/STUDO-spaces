import { ReactNode } from "react";
import AdminHeader from "@/components/ui/app/admin/adminheader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={"w-full h-full flex flex-col gap-5 py-15"}>
            <AdminHeader/>
            <div className={"w-full h-full"}>{children}</div>
        </div>);
}