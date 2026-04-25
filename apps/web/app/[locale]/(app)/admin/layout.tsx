import { ReactNode } from "react";
import AdminHeader from "@/components/ui/app/admin/adminheader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AdminHeader/>
            <div className={"w-full h-full"}>{children}</div>
        </>);
}