import { ReactNode } from "react";
import AdminHeader from "@/components/ui/app/private/admin/adminheader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col h-screen w-screen"}>
      <AdminHeader />
      <div
        className={
          "dark:bg-slate-800 min-w-0 min-h-0 flex-1 flex items-center p-5 flex-col gap-5"
        }
      >
        <div
          className={
            "max-w-350 flex-1 min-w-0 w-full h-full min-h-0 flex dark:text-white text-studodarkblue"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
