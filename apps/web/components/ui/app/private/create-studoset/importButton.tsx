"use client";
import { useTranslations } from "next-intl";
import { RiAiGenerate } from "react-icons/ri";
import { ComposerAura } from "@/components/ui/design_system/ComposeAura/ComposerAura";
import { Sparkle, Sparkles } from "lucide-react";

interface ImportButtonProps {
  setShowImporter: (value: boolean) => void;
}
export default function ImportButton({ setShowImporter }: ImportButtonProps) {
  const t = useTranslations("createstudoset");
  return (
    <ComposerAura>
      <div className="relative group">
        <div
          onClick={() => setShowImporter(true)}
          className="flex items-center border border-studoborder/30 justify-center w-fit h-10 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform"
          data-cy="import_button"
        >
          <div className="relative group flex items-center h-full justify-center  p-0.5 dark:bg-gray-700 bg-blue-50">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 aiBorderAnimation" />
            <div className="relative z-10 px-5 h-8.5 text-sm rounded-full dark:bg-gray-700 bg-blue-50 text-studodarklbue flex items-center justify-center gap-2 dark:text-white font-bold">
              <Sparkles size={15} />
              {t("import")}
            </div>
          </div>
        </div>
      </div>
    </ComposerAura>
  );
}
