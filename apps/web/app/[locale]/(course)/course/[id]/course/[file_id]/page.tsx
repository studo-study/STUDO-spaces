"use client";
import { useFile } from "@/hooks/app/courses/useFile";
import { usePathname } from "@/i18n/routing";
import PdfReader from "@/components/ui/app/private/course/cursus/filereader/PdfReader";
import { LoaderCircle } from "lucide-react";

export default function CourseDetailPage() {
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];
  const file = useFile(courseId, docId)?.data;

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
    <div className={"w-full h-full flex items-center"}>
      <PdfReader file={file} />
    </div>
  );
}
