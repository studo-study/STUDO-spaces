"use client";
import { useFile } from "@/hooks/app/courses/useFile";
import { usePathname } from "@/i18n/routing";
import PdfReader from "@/components/ui/app/private/course/cursus/filereader/PdfReader";
import { LoaderCircle } from "lucide-react";
import PdfIndex from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfIndex";
import { useRef } from "react";

export default function CourseDetailPage() {
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];
  const file = useFile(courseId, docId)?.data;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  if (!file) {
    return (
      <div
        className={
          "w-full h-full dark:text-white text-studodarkblue flex justify-center items-center"
        }
      >
        <LoaderCircle size={15} className={"animate-spin"} />
      </div>
    );
  }
  return (
    <div className={"relative w-full h-full flex items-center "}>
      <div
        className={
          "absolute z-9999 hidden left-0 top-0 h-50 min-h-full w-20 border-white md:flex flex-1 "
        }
      >
        <PdfIndex sectionRefs={sectionRefs} />
      </div>
      <PdfReader file={file} />
    </div>
  );
}
