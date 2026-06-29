import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppLayoutClient from "@/components/ui/app/private/AppLayoutClient";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import { ReactNode } from "react";

export default async function ModesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <AppLayoutClient variant="mode">
      <ResizablePanelLayout
        storageKey="mode-panels"
        panels={[
          { id: "main", defaultSize: 96, minSize: 50 },
          { id: "course", defaultSize: 30, minSize: 25, maxSize: 40 },
          { id: "sidebar", defaultSize: 4, minSize: 4, maxSize: 4 },
        ]}
      >
        <ResizablePanelLayout.Panel panelId="main">
          <div className="w-full h-full overflow-y-auto scroll-hidden pr-57">
            {children}
          </div>
        </ResizablePanelLayout.Panel>
        <ResizablePanelLayout.Panel panelId="course">
          <div className="h-full border-l border-studoborder/30 w-full" />
        </ResizablePanelLayout.Panel>
        <ResizablePanelLayout.Panel panelId="sidebar">
          <div className="h-full border-l border-studoborder/30 w-full" />
        </ResizablePanelLayout.Panel>
      </ResizablePanelLayout>
    </AppLayoutClient>
  );
}
