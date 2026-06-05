import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useSession } from "next-auth/react";
import { CardData } from "@/types/types";

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
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter((f) => ACCEPTED.includes(f.type));
    if (valid.length === 0) {
      setError("Alleen afbeeldingen en PDF's worden ondersteund.");
      return;
    }
    setError(null);
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
    setError(null);

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
      if (!res.ok)
        throw new Error(data?.message ?? `Server gaf een fout (${res.status})`);

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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Er ging iets mis. Probeer opnieuw.",
      );
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
      className={`
        relative w-full h-full overflow-hidden rounded-3xl border
        flex flex-col items-center justify-center px-6
        transition-all duration-300
        ${isDragging ? "border-blue-400/50" : "border-studoborder"}
        bg-studogrey/10
      `}
    >
      {/* glow orb bovenaan, jouw merk-blur */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[420px] h-[420px] -z-10 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: isDragging || files.length > 0 ? 0.9 : 0.5,
          background:
            "radial-gradient(circle at 50% 45%, #fb7185 0%, #f97316 30%, #fbbf24 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        className="hidden"
      />

      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        {/* titel */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-studodarkblue">
            Laat SVEN het werk doen
          </h2>
          <p className="text-sm text-white/40">
            Upload je notities. SVEN maakt er flashcards van.
          </p>
        </div>

        {/* centrale glass invoerbalk */}
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`
            glass-rgb w-full rounded-[28px] cursor-pointer
            transition-all duration-300 p-5
            ${isDragging ? "scale-[1.02] shadow-2xl" : "hover:scale-[1.01]"}
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          {/* bestanden als chips binnenin, zoals attachments in een chatinput */}
          {files.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl glass-rgb"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-studoborder/10 flex items-center justify-center shrink-0">
                      {file.type === "application/pdf" ? (
                        <svg
                          width="15"
                          height="15"
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
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-blue-400"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate dark:text-white/80 text-studodarkblue">
                        {file.name}
                      </p>
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
                    className="text-white/30 hover:text-red-400 transition-colors shrink-0 p-1 cursor-pointer"
                  >
                    <svg
                      width="15"
                      height="15"
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

          {/* placeholder-regel als er nog niks is, zoals "Ask anything" */}
          {files.length === 0 && (
            <p className="text-white/35 px-1 pb-6 text-base">
              {isDragging
                ? "Laat los om toe te voegen…"
                : "Sleep een bestand hierheen of klik om te kiezen"}
            </p>
          )}

          {/* onderbalk met icoon links en send-knop rechts, net als de referenties */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-9 h-9 rounded-full bg-studoborder/10 flex items-center justify-center">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <span className="text-xs">
                {files.length}/{MAX_FILES} · PDF, PNG, JPG
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={!canUpload}
              type="button"
              className={`
                relative w-11 h-11 rounded-full overflow-hidden
                flex items-center justify-center transition-all duration-300
                ${canUpload ? "cursor-pointer active:scale-95" : "cursor-not-allowed"}
              `}
            >
              <div
                className={`absolute inset-0 aiBorderAnimation transition-opacity duration-300 ${
                  canUpload ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`
                  relative z-10 w-full h-full rounded-full flex items-center justify-center
                  ${
                    canUpload
                      ? "bg-linear-to-br from-blue-400 to-blue-500 text-white"
                      : "bg-gray-700/60 text-white/25"
                  }
                `}
              >
                {isUploading ? (
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
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* status onder de balk: fout of SVEN-bezig, zoals suggestie-rijen */}
        <div className="w-full min-h-[20px] text-center">
          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : isUploading ? (
            <p className="text-sm text-white/40 animate-pulse">
              SVEN leest je bestand en maakt kaarten…
            </p>
          ) : (
            <p className="text-xs text-white/25">
              Werkt het best met heldere, leesbare notities
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
