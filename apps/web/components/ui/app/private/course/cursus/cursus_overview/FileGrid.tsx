"use client";
import FileItem from "./FileItem";
import classNames from "@/utils/classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useTranslations } from "next-intl";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { useUploadFile } from "@/hooks/app/courses/useUploadFile";
import { useParams } from "next/navigation";
import { CourseDocument } from "@studo/types";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import CourseOverviewHeader from "@/components/ui/app/private/course/cursus/cursus_overview/CourseOverviewHeader";
import EmptyFallback from "@studo/ui/design_system/EmptyFallback";
import UploadModal from "@/components/ui/app/private/course/cursus/cursus_overview/UploadModal";
import { useCourseNavStore } from "@/store/course/CourseNavStore";
import { ComposerAura } from "@studo/ui/design_system/composer_aura/ComposerAura";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { Sparkles } from "lucide-react";

const MAX_FILES = 3;
const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export type CourseTab = "all" | "summary" | "course" | "notes";

const FileGrid: React.FC = () => {
  const t = useTranslations("flow.course");
  const id = useParams().id as string;
  const course = useCourse(id)?.data;
  useCourseNav([
    {
      title: "home",
      href: `/home`,
      isLast: false,
      translate: true,
    },
    {
      title: course?.title ?? "",
      href: `/course/${id}/overview`,
      isLast: false,
      translate: false,
    },
    {
      title: "documents",
      href: `/course/${id}/documents`,
      isLast: true,
      translate: true,
    },
  ]);
  const setDocument = useCourseNavStore((state) => state.setDocument);

  useEffect(() => {
    setDocument("");
  }, [setDocument]);

  // server-documenten = bron van waarheid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documents: CourseDocument[] = useCourse(id).data?.documents ?? [];

  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();
  const [uploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // bestanden die nu geüpload worden (voor de progress-balk)
  const [files, setFiles] = useState<File[]>([]);

  const upload = useUploadFile(id);
  const isUploading = upload.isPending;

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid = Array.from(incoming)
        .filter((f) => ACCEPTED.includes(f.type))
        .slice(0, MAX_FILES);
      if (valid.length === 0) {
        toast.error(t("error_file_types"));
        return;
      }
      setFiles(valid);
      upload.mutate(valid, {
        onError: () => toast.error(t("error_upload")),
        onSettled: () => setFiles([]),
      });
    },
    [t, toast, upload],
  );

  //tabs & filters
  const [tab, setTab] = useState<CourseTab>("all");
  const [query, setQuery] = useState<string>("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const filteredDocs = useMemo(() => {
    return documents
      .filter((doc) => tab === "all" || doc.documentTag === tab) // tab-filter
      .filter(
        (
          doc, // zoek-filter
        ) =>
          doc.title.toLowerCase().trim().includes(query.toLowerCase().trim()),
      );
  }, [documents, query, tab]);

  return (
    <div className={"relative min-w-0 flex-1 flex flex-col gap-5"}>
      <CourseOverviewHeader
        setIsOpen={setIsUploadModalOpen}
        files={files}
        isUploading={isUploading}
        tab={tab}
        setTab={setTab}
        setQuery={setQuery}
        documents={documents}
      />
      <UploadModal
        addFiles={addFiles}
        isOpen={uploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
      <div className={"min-w-0 flex-1 flex justify-center"}>
        <div className={"relative min-w-0 min-h-0 flex-1 flex max-w-220"}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isUploading) setIsDragging(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={"min-h-0 min-w-0 flex-1 flex relative "}
          >
            <div
              className={classNames(
                "absolute h-full w-full z-40 border-3 rounded-4xl border-studoblue",
                isDragging ? "visible" : "hidden",
              )}
            />
            {filteredDocs.length === 0 ? (
              <EmptyFallback
                title={t("no_files_title")}
                cta={
                  <ComposerAura>
                    <BaseButton
                      onClick={() => setIsUploadModalOpen(true)}
                      type="button"
                      variant="submit"
                      className={"border-studoblue"}
                      label={t("no_files_paragraph")}
                      iconLeft={
                        <Sparkles
                          size={17}
                          className={
                            "dark:fill-white fill-studodarkblue stroke-0.5"
                          }
                        />
                      }
                    />
                  </ComposerAura>
                }
                icon={"folders"}
              />
            ) : (
              <div className={"grid grid-cols-4 gap-2  flex-wrap w-full"}>
                {filteredDocs.map((file, index) => (
                  <FileItem file={file} key={file.id + index} />
                ))}
                {files.length > 0 && (
                  <span className={"text-sm text-studogrey"}>
                    {files.length} {t("pending_upload")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FileGrid.displayName = "FileGrid";
export default FileGrid;
