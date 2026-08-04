import { ReactNode } from "react";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import CourseSidebar from "@/components/ui/app/private/course/layout/CourseSidebar";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"w-screen h-screen"}>
      <ResizablePanelLayout
        storageKey="studoset-sidebar"
        panels={[
          {
            id: "sidebar",
            defaultSize: 15,
            minSize: 15,
            maxSize: 15,
          },
          { id: "main", defaultSize: 2000, minSize: 40 },
        ]}
      >
        <ResizablePanelLayout.Panel panelId="sidebar">
          <CourseSidebar />
        </ResizablePanelLayout.Panel>
        <ResizablePanelLayout.Panel panelId="main">
          <div className={"w-full h-full flex relative"}>{children}</div>
        </ResizablePanelLayout.Panel>
      </ResizablePanelLayout>
    </div>
  );
}
