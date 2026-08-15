"use client";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import { ComposerAura } from "@studo/ui/design_system/composer_aura/ComposerAura";

interface ImportButtonProps {
  setShowImporter: (value: boolean) => void;
}

export default function ImportButton({ setShowImporter }: ImportButtonProps) {
  const t = useTranslations("createstudoset");
  const [showGlow] = useState(true);
  return (
    <ComposerAura>
      <div className="relative group">
        {showGlow && (
          <div
            className=" opacity-0 group-hover:animate-pulse group-hover:opacity-30 transition-opacity duration-400 pointer-events-none absolute -inset-3 rounded-[44px] blur-2xl"
            style={{
              background:
                "linear-gradient(90deg, #6366f1, #c026d3, #fb7185, #38bdf8, #6366f1)",
              backgroundSize: "300% 100%",
            }}
            aria-hidden="true"
          />
        )}
        <div
          onClick={() => setShowImporter(true)}
          className="flex items-center border border-studoborder/30 justify-center w-fit h-10 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform"
          data-cy="import_button"
        >
          <div className="relative group flex items-center h-full justify-center  p-0.5 dark:bg-gray-700 bg-blue-50">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 aiBorderAnimation" />
            <div className="relative z-10 px-5 h-8.5 text-sm rounded-full dark:bg-gray-700 bg-blue-50 text-studodarklbue flex items-center justify-center gap-2 dark:text-white font-bold">
              <Sparkles
                size={15}
                strokeWidth={1}
                className={"dark:fill-white fill-studodarkblue"}
              />
              {t("import")}
            </div>
          </div>
        </div>
      </div>
    </ComposerAura>
  );
}
