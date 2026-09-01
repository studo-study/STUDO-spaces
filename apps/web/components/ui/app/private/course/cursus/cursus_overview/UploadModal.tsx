"use client";
import React, { SetStateAction, useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { HiSparkles } from "react-icons/hi";
import { LuFileText } from "react-icons/lu";
import { BsFilePdf } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";

const MAX_FILES = 3;
const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

interface UploadModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  addFiles: (incoming: FileList | File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  setIsOpen,
  addFiles,
}) => {
  const t = useTranslations("svenimport");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onClose = useCallback(() => {
    setIsDragging(false);
    setFiles([]);
    setIsOpen(false);
  }, [setFiles, setIsOpen]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files)
      setFiles((prev) => [...prev, ...e.dataTransfer.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    addFiles(files);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col justify-between items-center z-9999
      bg-blue-50 dark:bg-bg-dark px-4 sm:px-6 md:px-10 py-4 sm:py-5"
    >
      <div className="relative w-full h-14 flex flex-row justify-center items-center">
        <div className="absolute right-0">
          <IoClose
            size={28}
            onClick={onClose}
            className="cursor-pointer text-gray-700 dark:text-white hover:text-gray-500 sm:w-8.75 sm:h-8.75"
          />
        </div>
      </div>

      <div className="w-2/3 h-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={(e) => {
            const selected = e.target.files;
            if (selected) {
              setFiles((prev) => [...prev, ...selected]);
            }
          }}
          className="hidden"
        />

        <div className="w-full h-full grid grid-cols-2 gap-10">
          <div className="w-full h-full flex flex-col gap-5">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={` ${files.length === MAX_FILES && "opacity-30 cursor-not-allowed pointer-events-none"}
                w-full h-full rounded-4xl border
                flex flex-col items-center justify-center p-5
                transition-all duration-500
     
                ${
                  isDragging
                    ? "border-blue-400/50 shadow-[0_0_60px_-10px_rgba(96,165,250,0.3)]"
                    : "border-neutral-200 hover:border-neutral-400/80"
                }
                bg-studogrey/10
              `}
            >
              <div className="flex flex-col items-center justify-center gap-10 select-none">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-28 h-28 rounded-full dark:bg-white/3 bg-black/3 animate-pulse" />
                  <div className="absolute w-20 h-20 rounded-full dark:bg-white/4 bg-black/4 animate-pulse [animation-delay:0.4s]" />
                  <div className="relative w-14 h-14 rounded-2xl glass-rgb flex items-center justify-center dark:text-white/50 text-studodarkblue/50">
                    <RiAiGenerate size={26} />
                  </div>
                </div>
                <p className="text-sm dark:text-white/35 text-studodarkblue/40 text-center leading-relaxed max-w-[180px]">
                  {isDragging ? t("drop_here") : t("drag_or_click")}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-full flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold dark:text-white text-studodarkblue">
                {t("title")}
              </span>
              <span className="text-sm dark:text-white/40 text-studodarkblue/50">
                pdf, docx, xlsx
              </span>
            </div>

            {files.length === 0 ? (
              <div className="text-sm w-full rounded-3xl bg-studogrey/5 flex items-center justify-center flex-1 dark:text-white/25 text-studodarkblue/30">
                {t("no_files")}
              </div>
            ) : (
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-full h-fit flex justify-end text-xs">
                  <span>
                    {files.length} / {MAX_FILES}
                  </span>
                </div>
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl border cursor-pointer hover:border-neutral-400 transition-all duration-300 border-neutral-200/30 bg-studogrey/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-studoborder/60 flex items-center justify-center shrink-0">
                        {file.type === "application/pdf" ? (
                          <BsFilePdf size={14} className="text-red-400" />
                        ) : (
                          <LuFileText size={14} className="text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate dark:text-white/80 text-studodarkblue">
                          {file.name}
                        </p>
                        <p className="dark:text-white/30 text-studodarkblue/40 text-xs">
                          {formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="dark:text-white/30 text-studodarkblue/30 hover:text-red-400 transition-colors shrink-0 p-1 cursor-pointer"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto min-w-full">
              <BaseButton
                onClick={handleUpload}
                type="button"
                variant="submit"
                label={t("upload")}
                className="min-w-full"
                iconLeft={<HiSparkles />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UploadModal.displayName = "UploadModal";
export default UploadModal;
