import { useTranslations } from "next-intl";
import { IoIosAdd } from "react-icons/io";
import { useRef } from "react";
import { MdDelete, MdDragIndicator } from "react-icons/md";
import InputField from "@/components/ui/design_system/input/InputField";

interface CardProps {
  index: number;
  id: string;
  insertCard: () => void;
  deleteCard: (id: string) => void;
  updateCard: (id: string, term: string, definitie: string) => void;
  isDouble: boolean;
  length: number;
  term: string;
  definition: string;
}
export default function CardItem({
  index,
  id,
  deleteCard,
  isDouble,
  updateCard,
  length,
  term,
  definition,
  insertCard,
}: CardProps) {
  const t = useTranslations("card");
  const defRef = useRef<HTMLInputElement>(null);

  return (
    <div className={"w-full h-fit relative mb-5"}>
      <div
        className={`flex flex-col justify-around items-baseline relative h-fit overflow-hidden w-full gap-3 sm:gap-4 md:gap-5 border  ${isDouble ? "border-emerald-400 dark:border-studoblue" : "border-studoborder/30"} rounded-2xl sm:rounded-4xl`}
      >
        {/* Header */}
        <div className="w-full h-10 sm:h-[52px] rounded-t-3xl dark:bg-gray-700/50 bg-zinc-300/20 flex justify-between items-center p-2 px-4 sm:p-3 sm:px-6 md:px-8 overflow-hidden">
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
          <div className="flex flex-col p-3 w-full gap-3 justify-between">
            <InputField
              variant={"cardInput"}
              value={term}
              onChange={(e) => updateCard(id, "term", e.target.value)}
              placeholder={t("Term")}
            />
          </div>

          <div className="flex flex-col p-3 w-full gap-3 justify-between">
            <InputField
              variant={"cardInput"}
              ref={defRef}
              value={definition}
              onChange={(e) => updateCard(id, "definition", e.target.value)}
              placeholder={t("Definition")}
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
