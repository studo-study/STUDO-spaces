import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useSession } from "next-auth/react";
import { CardData } from "@/types/types";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { HiSparkles } from "react-icons/hi";
import { LuImage } from "react-icons/lu";
import { BsFilePdf } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";

const MAX_FILES = 3;
const ACCEPTED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "application/pdf",
];

interface importerProps {
  onClose: () => void;
  cardArray: CardData[];
  setCardArray: Dispatch<SetStateAction<CardData[]>>;
}

export default function SvenImport({
  onClose,
  cardArray,
  setCardArray,
}: importerProps) {
  const t = useTranslations("svenimport");
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter((f) => ACCEPTED.includes(f.type));
    if (valid.length === 0) {
      toast.error(t("error_file_types"));
      return;
    }
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sven/import_studoset`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          body: formData,
        },
      );
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? t("server_error", { status: res.status }));
        return;
      }

      const VALID_CONTENT_TYPES = ["text", "latex", "code"] as const;
      const cards = data.map(
        (
          card: Partial<CardData> & { special_content_type?: string },
          index: number,
        ) => {
          const rawType = card.special_content_type ?? card.contentType;
          const contentType: "text" | "latex" | "code" =
            rawType &&
            (VALID_CONTENT_TYPES as readonly string[]).includes(rawType)
              ? (rawType as "text" | "latex" | "code")
              : "text";
          return {
            ...card,
            contentType,
            codeLanguage: card.codeLanguage ?? "typescript",
            id: crypto.randomUUID(),
            index: cardArray.length + index,
            image: "",
            isDouble: false,
          };
        },
      );

      setCardArray((prev) => [...prev, ...cards]);
      onClose();
    } catch {
      toast.error(t("sum_wrong"));
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const canUpload = files.length > 0 && !isUploading;

  return (
    <div className="w-2/3 h-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        className="hidden"
      />

      <div className="w-full h-full grid grid-cols-2 gap-10">
        {/* Linker kolom: dropzone */}
        <div className="w-full h-full flex flex-col gap-5">
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
            onClick={() => !isUploading && inputRef.current?.click()}
            className={`
              w-full h-full rounded-4xl border cursor-pointer
              flex flex-col items-center justify-center p-5
              transition-all duration-500
              ${isUploading ? "pointer-events-none opacity-60" : ""}
              ${
                isDragging
                  ? "border-blue-400/50 shadow-[0_0_60px_-10px_rgba(96,165,250,0.3)]"
                  : "border-studoborder hover:border-studoborder/80"
              }
              bg-studogrey/10
            `}
          >
            <div className="flex flex-col items-center justify-center gap-5 select-none">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full dark:bg-white/[0.03] bg-black/[0.03] animate-pulse" />
                <div className="absolute w-20 h-20 rounded-full dark:bg-white/[0.04] bg-black/[0.04] animate-pulse [animation-delay:0.4s]" />
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
              PDF, PNG, JPG, WEBP · max {MAX_FILES}
            </span>
          </div>

          {files.length === 0 ? (
            <span className="text-sm w-full flex items-center justify-center flex-1 dark:text-white/25 text-studodarkblue/30">
              {t("no_files")}
            </span>
          ) : (
            <div className="flex flex-col gap-2">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl border border-studoborder bg-studogrey/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-studoborder/10 flex items-center justify-center shrink-0">
                      {file.type === "application/pdf" ? (
                        <BsFilePdf size={14} className="text-red-400" />
                      ) : (
                        <LuImage size={14} className="text-blue-400" />
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
              disabled={!canUpload}
              type={"button"}
              variant={"submit"}
              label={isUploading ? t("loading") : t("upload")}
              className={"min-w-full"}
              iconLeft={<HiSparkles />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
