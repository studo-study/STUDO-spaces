"use client";
import FileItem from "./FileItem";
import classNames from "@/utils/classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useTranslations } from "next-intl";

const MAX_FILES = 3;
const MAX_DAILY_USES = 3;
const RATE_LIMIT_KEY = "sven_import_usage";
const ACCEPTED = ["application/pdf", "document/docx", "xlsx"];
const FileGrid: React.FC = () => {
  const t = useTranslations("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
      setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
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
          <FileItem />
          <FileItem />
          <FileItem />
          <FileItem />
          <FileItem />
          <FileItem />
        </div>
      </div>
    </div>
  );
};

FileGrid.displayName = "FileGrid";
export default FileGrid;
