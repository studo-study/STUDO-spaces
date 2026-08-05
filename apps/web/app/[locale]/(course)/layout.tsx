"use client";
import { ReactNode } from "react";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import CourseSidebar from "@/components/ui/app/private/course/layout/CourseSidebar";
import LayoutHeader from "@/components/ui/app/private/course/layout/LayoutHeader";
import SideMenu from "@/components/ui/app/private/course_context_menu/SideMenu";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"w-screen h-screen flex flex-col"}>
      <LayoutHeader />
      <div className={"w-screen min-h-0 flex-1 flex flex-row"}>
        <CourseSidebar />

        <div className={"min-h-0 min-w-0 flex-1 flex relative px-5 pb-5"}>
          <div
            className={
              "border border-studoborder/30 rounded-4xl dark:bg-slate-800 min-h-0 min-w-0 flex-1 flex overflow-hidden"
            }
          >
            <ResizablePanelLayout
              storageKey="studoset-sidebar"
              panels={[
                {
                  id: "sidebar",
                  defaultSize: 12,
                  minSize: 12,
                  maxSize: 12,
                },
                { id: "main", defaultSize: 2000, minSize: 40 },
              ]}
            >
              <ResizablePanelLayout.Panel panelId="main">
                {children}
              </ResizablePanelLayout.Panel>
            </ResizablePanelLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
