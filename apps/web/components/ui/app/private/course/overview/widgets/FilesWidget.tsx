import type { ReactNode } from "react";
import { FileText, LoaderCircle, CircleX } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useWidgetMenu } from "@/store/course_context_menu/WidgetMenuStore";
import { useCourseDocs } from "@/hooks/app/courses/useCourse";

export default function FilesWidget({
  icon,
  type,
}: {
  icon: ReactNode;
  type: string;
}) {
  const courseId = useWidgetMenu((s) => s.courseId);
  const documents = useCourseDocs(courseId ?? "") ?? [];

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center gap-2 text-sm text-studogrey"
      }
    >
      <div className={"w-full flex flex-row gap-2 items-center"}>
        {icon}
        <span className={"font-semibold capitalize"}>{type}</span>
      </div>

      <div
        className={
          "flex-1 min-h-0 w-full flex flex-col gap-2 overflow-y-scroll scroll-hidden"
        }
      >
        {documents.length === 0 && (
          <span className={"m-auto text-xs"}>No documents yet</span>
        )}
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`/course/${courseId}/documents/${doc.id}`}
            className={
              "flex flex-row h-10 rounded-full items-center gap-2 px-3 border border-transparent hover:border-studoborder/30 hover:bg-studogrey/30 bg-studogrey/20 transition-colors"
            }
          >
            <FileText size={14} className={"shrink-0"} />
            <span
              className={
                "truncate min-w-0 flex-1 dark:text-white text-studodarkblue"
              }
            >
              {doc.title}
            </span>
            {doc.status === "failed" ? (
              <CircleX size={12} className={"shrink-0 text-rose-500"} />
            ) : doc.status !== "finished" ? (
              <LoaderCircle size={12} className={"shrink-0 animate-spin"} />
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
