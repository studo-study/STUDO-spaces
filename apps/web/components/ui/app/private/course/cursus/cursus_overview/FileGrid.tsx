"use client";
import FileItem from "./FileItem";
import classNames from "@/utils/classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useTranslations } from "next-intl";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { useParams } from "next/navigation";
import { CourseDocument } from "@studo/types";

const MAX_FILES = 3;
const MAX_DAILY_USES = 3;
const RATE_LIMIT_KEY = "sven_import_usage";
const ACCEPTED = ["application/pdf", "document/docx", "xlsx"];
const FileGrid: React.FC = () => {
  const t = useTranslations("");
  const id = useParams().id;
  // server-documenten = bron van waarheid
  const documents: CourseDocument[] =
    useCourse(id as string).data?.documents ?? [];
  // lokaal gedropte bestanden die nog geüpload moeten worden
  const [pending, setPending] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const getRateLimitData = () => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) return { count: 0, date: "" };
      return JSON.parse(stored) as { count: number; date: string };
    } catch {
      return { count: 0, date: "" };
    }
  };

  const checkRateLimit = () => {
    const { count, date } = getRateLimitData();
    if (date !== new Date().toDateString()) return true;
    return count < MAX_DAILY_USES;
  };

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid = Array.from(incoming).filter((f) =>
        ACCEPTED.includes(f.type),
      );
      if (valid.length === 0) {
        toast.error(t("error_file_types"));
        return;
      }
      setPending((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    },
    [t, toast],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  return (
    <div className={"relative w-full h-full"}>
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
        className={"w-full h-full relative "}
      >
        <div
          className={classNames(
            "absolute h-full w-full z-40 border-3 rounded-2xl border-studoblue",
            isDragging ? "visible" : "hidden",
          )}
        />
        <div className={"flex flex-row flex-wrap w-full"}>
          {documents.map((file, index) => (
            <FileItem file={file} key={file.id + index} />
          ))}
          {pending.length > 0 && (
            <span className={"text-sm text-studogrey"}>
              {pending.length} {t("pending_upload")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

FileGrid.displayName = "FileGrid";
export default FileGrid;
