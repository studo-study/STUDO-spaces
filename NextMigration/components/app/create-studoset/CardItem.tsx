import { useFormContext } from "react-hook-form";
import {useTranslations} from "next-intl";
import {IoIosAdd} from "react-icons/io";
import {useRef} from "react";

interface CardProps {
    index: number;
    id: string;
    deleteCard: (id: string) => void
    updateCard: (id: string, term: string, definitie: string) => void
    isDouble: boolean;
}
export default function CardItem({ index, id, deleteCard, isDouble, updateCard }: CardProps) {
    const t = useTranslations("card");
    const termRef = useRef<HTMLInputElement>(null);
    const defRef = useRef<HTMLInputElement>(null);

    return (
        <div
            className={`flex flex-col justify-around items-baseline relative h-fit overflow-hidden w-full gap-3 sm:gap-4 md:gap-5 border  ${isDouble ? 'border-emerald-400 dark:border-studoblue' : 'border-studoborder/30'} rounded-2xl sm:rounded-4xl mb-6 sm:mb-8 md:mb-10`}>

            {/* Header */}
            <div
                className="w-full h-10 sm:h-[52px] rounded-t-3xl bg-gray-700/50 flex justify-between items-center p-2 px-4 sm:p-3 sm:px-6 md:px-8 overflow-hidden">
                <span className="text-sm sm:text-base text-studodarkblue dark:text-white">{index + 1}</span>
                <div className="flex gap-2 sm:gap-3">
                    <img
                        onClick={() => {deleteCard(id)}}
                        src="/icons/delete.svg"
                        alt="delete"
                        className="cursor-pointer h-4 sm:h-5 dark:invert dark:brightness-0"
                    />
                    <img
                        src="/icons/grab.svg"
                        alt="grab"
                        className="handle cursor-grab h-4 sm:h-5 dark:invert dark:brightness-0"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-3 px-5 pb-4 sm:pb-6">
                <div className="flex flex-col p-3 w-full gap-3 justify-between">
                    <input
                        ref={termRef}
                        type="text"
                        onInput={(e) => updateCard(id, "term", e.target.value)}
                        className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                        autoComplete="off"
                        placeholder={t("Term")}
                    />
                </div>

                <div className="flex flex-col p-3 w-full gap-3 justify-between">
                    <input
                        ref={defRef}
                        type="text"
                        onInput={(e) => updateCard(id, "definition", e.target.value)}
                        className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                        autoComplete="off"
                        placeholder={t("Definition")}
                    />
                </div>
            </div>

            <div className="absolute w-full flex items-center justify-center -bottom-2.5">
                <div
                    className="relative cursor-pointer bg-blue-500 min-h-[28px] min-w-[28px] flex items-center justify-center text-xl text-white rounded-full border border-studoborder opacity-0 -translate-y-1 hover:opacity-100 hover:translate-y-0 duration-300 active:scale-95 transition-all z-10">
                    <IoIosAdd/>
                </div>
            </div>
        </div>
    );
}
