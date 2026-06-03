import { useTranslations } from "next-intl";
import { IoIosAdd } from "react-icons/io";
import React, { useState } from "react";
import { MdDelete, MdDragIndicator } from "react-icons/md";
import LaTexInput from "@/components/ui/design_system/input/LaTeXInput";

interface CardProps {
  index: number;
  id: string;
  insertCard: () => void;
  deleteCard: (id: string) => void;
  updateCard: (id: string, field: string, value: string | boolean) => void;
  isDouble: boolean;
  contentType: "text" | "latex" | "code";
  codeLanguage: string;
  length: number;
  term: string;
  definition: string;
  termRef?: React.Ref<HTMLInputElement | null>;
  defRef?: React.Ref<HTMLInputElement | null>;
  onEnterDefinition?: () => void;
}
export default function CardItem({
  index,
  id,
  deleteCard,
  isDouble,
  contentType: contentTypeProp,
  codeLanguage: codeLanguageProp,
  updateCard,
  length,
  term,
  definition,
  insertCard,
  termRef,
  defRef,
  onEnterDefinition,
}: CardProps) {
  const t = useTranslations("card");
  const [contentType, setContentType] = useState<"text" | "latex" | "code">(
    contentTypeProp,
  );
  const [codeLanguage, setCodeLanguage] = useState<string>(codeLanguageProp);

  const handleSetContentType = (value: "text" | "latex" | "code") => {
    setContentType(value);
    updateCard(id, "contentType", value);
  };

  const handleSetCodeLanguage = (value: string) => {
    setCodeLanguage(value);
    updateCard(id, "codeLanguage", value);
  };

  return (
    <div className={"w-full h-fit relative mb-5"}>
      <div
        className={`flex flex-col justify-around items-baseline relative h-fit w-full gap-3 sm:gap-4 md:gap-5 border  ${isDouble ? "border-emerald-400 dark:border-studoblue" : "border-studoborder/30"} rounded-2xl sm:rounded-4xl`}
      >
        {/* Header */}
        <div className="w-full h-10 sm:h-[52px] rounded-t-3xl dark:bg-gray-700/50 bg-zinc-300/20 flex justify-between items-center p-2 px-4 sm:p-3 sm:px-6 md:px-8">
          <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
            {index + 1}
          </span>
          <div className="flex gap-2 sm:gap-3">
            {length != 1 && (
              <MdDelete
                className="cursor-pointer hover:text-gray-500"
                onClick={() => {
                  deleteCard(id);
                }}
              />
            )}
            <MdDragIndicator className="handle cursor-grab active:cursor-grabbing" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-3 px-5 pb-4 sm:pb-6">
          <div className={"h-full w-full lg:w-1/2 min-w-0"}>
            <LaTexInput
              ref={termRef}
              contentType={contentType}
              setContentType={handleSetContentType}
              codeLanguage={codeLanguage}
              onCodeLanguageChange={handleSetCodeLanguage}
              value={term}
              onChange={(value) => updateCard(id, "term", value)}
              placeholder={t("Term")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  defRef?.current?.focus();
                }
              }}
            />
          </div>
          <div className={"h-full w-full lg:w-1/2 min-w-0"}>
            <LaTexInput
              ref={defRef}
              value={definition}
              contentType={contentType}
              setContentType={handleSetContentType}
              codeLanguage={codeLanguage}
              hidden
              onChange={(value) => updateCard(id, "definition", value)}
              placeholder={t("Definition")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onEnterDefinition?.();
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="absolute min-w-full flex group items-center justify-center -bottom-2.5">
        <button
          type={"button"}
          onClick={insertCard}
          className="relative cursor-pointer bg-blue-500 min-h-[28px] min-w-[28px] flex items-center justify-center text-xl text-white rounded-full border border-studoborder opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 duration-300 active:scale-95 transition-all z-10"
        >
          <IoIosAdd />
        </button>
      </div>
    </div>
  );
}
