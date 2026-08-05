"use client";
import { usePathname } from "@/i18n/routing";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import React, { ReactNode } from "react";
import ButtonRow from "@/components/ui/design_system/button/ButtonRow";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useCourseNavStore } from "@/store/course/CourseNavStore";
import { useFile } from "@/hooks/app/courses/useFile";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { usePdfReader } from "@/store/course_context_menu/PdfStore";
import CourseSidebar from "@/components/ui/app/private/course_context_menu/CourseSidebar";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import SideMenu from "@/components/ui/app/private/course_context_menu/SideMenu";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";
export default function CourseDetailPage({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];
  const { currentPage, setCurrentPage, numPages } = usePdfReader();
  const menuOpen = useSideMenu((state) => state.menuInfo);
  const metaData = useCourse(courseId)?.data?.documents.find(
    (doc) => doc.id === docId,
  );
  const document = useFile(courseId, docId)?.data;
  console.log(document);
  const title = metaData?.title ?? document?.title;

  const setTitle = useCourseNavStore((state) => state.setDocument);
  useCourseNav([
    { title: "Course", href: `/course/${courseId}/course`, isLast: false },
    {
      title: title ?? "",
      href: `/course/${courseId}/course/${docId}`,
      isLast: true,
    },
  ]);

  const toggleUp = () => {
    if (!isAtEnd) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleDown = () => {
    if (!isAtStart) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isAtStart = currentPage - 1 === 0;
  const isAtEnd = currentPage + 1 > numPages;
  return (
    <div className={"min-w-0 min-h-0 flex-1 flex flex-col"}>
      <div
        className={
          "w-full flex flex-row items-center justify-between gap-3 p-5 border-b border-studoborder/30"
        }
      >
        <input
          className={"font-bold text-lg outline-none truncate"}
          type={"text"}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className={"items-center flex flex-row gap-2"}>
          <ButtonRow
            buttons={[
              {
                icon: <ChevronDown size={15} />,
                onClick: toggleUp,
                disabled: isAtEnd,
              },
              {
                type: "text_row",
                numPages: numPages ?? 0,
                currentPage: currentPage,
              },
              {
                icon: <ChevronUp size={15} />,
                onClick: toggleDown,
                disabled: isAtStart,
              },
              {
                icon: <Plus size={15} />,
              },
            ]}
          />
        </div>
      </div>
      <div className={"min-w-0 min-h-0 flex-1 flex flex-row"}>
        <ResizablePanelLayout
          storageKey="studoset-sidebar"
          panels={[
            { id: "main", defaultSize: 78, minSize: 40 },
            {
              id: "contextmenu",
              defaultSize: 30,
              minSize: 30,
              maxSize: 45,
            },
          ]}
        >
          <ResizablePanelLayout.Panel panelId="main">
            {children}
          </ResizablePanelLayout.Panel>
          {menuOpen.isOpen && (
            <ResizablePanelLayout.Panel panelId="contextmenu">
              <SideMenu origin={menuOpen?.origin ?? ""} />
            </ResizablePanelLayout.Panel>
          )}
        </ResizablePanelLayout>
        <CourseSidebar />
      </div>
    </div>
  );
}
