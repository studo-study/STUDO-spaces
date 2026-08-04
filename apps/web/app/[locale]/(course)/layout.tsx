import { ReactNode, SetStateAction } from "react";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import CourseSidebar from "@/components/ui/app/private/course/layout/CourseSidebar";
import AppHeader from "@/components/ui/app/private/app_header/AppHeader";
import LayoutHeader from "@/components/ui/app/private/course/layout/LayoutHeader";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"w-screen h-screen flex flex-col"}>
      <LayoutHeader />
      <div className={"w-screen min-h-0 flex-1 flex"}>
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
          <ResizablePanelLayout.Panel panelId="sidebar">
            <div className={"min-h-0 min-w-0 flex-1"}>
              <CourseSidebar />
            </div>
          </ResizablePanelLayout.Panel>
          <ResizablePanelLayout.Panel panelId="main">
            <div className={"min-h-0 min-w-0 flex-1 flex relative px-5 pb-5"}>
              <div
                className={
                  "border border-studoborder/30 rounded-3xl bg-studogrey/10 min-h-0 min-w-0 flex-1 flex "
                }
              >
                {children}
              </div>
            </div>
          </ResizablePanelLayout.Panel>
        </ResizablePanelLayout>
      </div>
    </div>
  );
}
