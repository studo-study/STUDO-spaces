"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import { useCreateFolder } from "@/hooks/app/folders/useCreateFolder";
import { useToast } from "@/components/providers/app/ToastProvider";

interface CreateFolderProps {
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
}

export default function CreateFolder({
  createOpen,
  setCreateOpen,
}: CreateFolderProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("createfolder");
  const mutation = useCreateFolder();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useKeyboardShortcut(
    "Escape",
    () => {
      setCreateOpen(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    { always: true },
  );

  useEffect(() => {
    if (!createOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createOpen, setCreateOpen]);

  useEffect(() => {
    if (createOpen) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [createOpen]);

  const isOpen = mounted && createOpen;
  const close = () => setCreateOpen(false);
  const toast = useToast();
  const handleSubmit = async () => {
    const name = inputRef.current?.value.trim();
    if (!name) return;
    try {
      await mutation.mutateAsync({ name });
      if (inputRef.current) inputRef.current.value = "";
      toast.success("folder created");
      close();
    } catch {
      toast.error("folder creation failed");
    }
  };

  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setCreateOpen}>
      <div
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
        }}
        ref={popupRef}
        className={`relative w-1/5 p-7 rounded-2xl bg-white/80 dark:bg-[#1e293b] border border-white/50 dark:border-white/10 shadow-xl transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
      >
        <button
          onClick={close}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-studogrey transition-colors cursor-pointer"
        >
          <IoIosClose className="text-3xl text-studodarkblue dark:text-white" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Image
            src="/icons/folder.svg"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 brightness-0 dark:invert"
          />
          <span className="text-xl font-bold text-studodarkblue dark:text-white">
            {t("title")}:
          </span>
        </div>

        <input
          ref={inputRef}
          placeholder={t("placeholder")}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full h-12 px-5 mb-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-full h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white font-bold border border-studoborder active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "..." : t("button")}
        </button>
      </div>
    </PopupBackdrop>
  );
}
