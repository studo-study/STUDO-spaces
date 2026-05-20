import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { CardData } from "@/types/types";
import { RxShare2 } from "react-icons/rx";

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
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter((f: File) =>
      ACCEPTED.includes(f.type),
    );
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
    console.log("UPLOAD TRIGGERED");
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    console.log("files:", files);
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const cards = data.map((card: Partial<CardData>, index: number) => ({
        ...card,
        id: crypto.randomUUID(),
        index: cardArray.length + index,
        image: "",
        isDouble: false,
      }));

      setCardArray((prev) => [...prev, ...cards]);
      onClose(); // pas hier
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="w-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          w-full max-w-lg aspect-square rounded-3xl cursor-pointer
          border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center gap-4 p-8
          ${
            isDragging
              ? "border-studoblue bg-studoblue/10 scale-[1.02]"
              : "border-studoborder/40 bg-studogrey/20 hover:border-studoborder/60 hover:bg-studogrey/30"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
          className="hidden"
        />

        <div
          className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          transition-all duration-300 text-3xl border border-studoborder/30
          ${isDragging ? "bg-studoblue/20" : "bg-studoborder/10"}
        `}
        >
          <RxShare2 />
        </div>

        <div className="text-center">
          <p className="dark:text-white/80 text-studodarkblue font-medium text-lg">
            {isDragging
              ? "Drop je bestanden hier"
              : "Sleep afbeeldingen hierheen"}
          </p>
          <p className="dark:text-white/40 text-studodarkblue text-sm mt-1">
            of klik om te selecteren - max {MAX_FILES} bestanden
          </p>
          <p className="dark:text-white/30 text-studodarkblue/30 text-xs mt-2">
            PNG, JPG, WebP, PDF
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="w-full max-w-lg flex flex-col gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-studogrey/20 border border-studoborder/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-studoborder/10 flex items-center justify-center shrink-0">
                  {file.type === "application/pdf" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-red-400"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-blue-400"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-sm truncate">{file.name}</p>
                  <p className="text-white/30 text-xs">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-white/30 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-lg">
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          type="button"
          className={`
                    relative  overflow-hidden
            w-full rounded-full font-bold text-lg
            transition-all duration-300 cursor-pointer select-none
           h-full justify-center p-0.75 bg-gray-700
            ${
              files.length === 0 || isUploading
                ? "bg-gray-700 text-white/20 cursor-not-allowed"
                : "bg-linear-to-br from-blue-400 to-blue-500 text-white active:scale-[0.98] shadow-xl"
            }
          `}
        >
          <div
            className={`absolute inset-0 z-0 w-full h-full  aiBorderAnimation transition-all duration-300 ${files.length === 0 || isUploading ? "opacity-0" : "opacity-100"}`}
          />
          <div
            className={`relative bg-w-full z-10 h-12 flex rounded-full items-center justify-center  ${
              files.length === 0 || isUploading
                ? "bg-gray-700 text-white/20 cursor-not-allowed"
                : "bg-linear-to-br from-gray-700 to-gray-600 text-white active:scale-[0.98] shadow-xl"
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                SVEN ANALYSEERT...
              </span>
            ) : (
              `IMPORTEER ${files.length > 0 ? `(${files.length})` : ""}`
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
