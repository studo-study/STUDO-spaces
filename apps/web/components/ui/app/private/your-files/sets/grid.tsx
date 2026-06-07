"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import SetSearch from "@/components/ui/app/private/your-files/sets/search";
import ListItems from "@/components/ui/app/private/your-files/sets/listitems";
import Image from "next/image";
import { useSets } from "@/hooks/app/sets/useSets";
import { StudysetResponse, type VisualsetResponse } from "@studo/types";

export interface StudySetItem {
  id: string;
  title: string;
  course: string;
  studoset?: boolean;
  global_term_language?: string;
  global_definition_language?: string;
  created_at: string;
  last_updated: string;
  public_set: boolean;
  displayName: string;
  img_url: string;
  user_id: string;
  folder_id?: string | null;
  type: "studyset" | "visualset";
}

export default function Grid() {
  const { sets, visualsets } = useSets();
  const allSets: StudySetItem[] = useMemo(
    () => [
      ...sets.map((s: StudysetResponse) => ({
        ...s,
        type: "studyset" as const,
      })),
      ...visualsets.map((s: VisualsetResponse) => ({
        ...s,
        type: "visualset" as const,
      })),
    ],
    [sets, visualsets],
  );

  const containerRef = useRef(null);
  const [AddIsOpen, setAddIsOpen] = useState(false);
  const [sortMode, setSortMode] = useState<"all" | "recent" | "created">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = useMemo(() => {
    let result = allSets;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q),
      );
    }
    if (sortMode === "recent")
      return [...result].sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      );
    if (sortMode === "created")
      return [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    return result;
  }, [allSets, sortMode, searchQuery]);

  const togglePopUp = () => setAddIsOpen((prev) => !prev);
  const toggleCreate = () => setAddIsOpen((prev) => !prev);

  const t = useTranslations("y_f.your_sets");

  return (
    <div className="relative w-full h-full flex flex-col gap-5 scroll-hidden overflow-y-scroll overflow-x-visible">
      <div className="sticky top-0 w-full h-20 z-20 backdrop-blur-2xl py-8 flex overflow-visible flex-row items-center justify-between gap-3">
        <div className="w-fit flex flex-row gap-5 items-center">
          <select
            name="sort sets"
            value={sortMode}
            onChange={(e) =>
              setSortMode(e.target.value as "all" | "recent" | "created")
            }
            className="
                            px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                            border dark:border-studogrey/30 border-gray-200
                            bg-white/50 dark:bg-gray-700
                            text-studodarkblue dark:text-white
                            font-medium text-xs sm:text-sm
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            cursor-pointer w-45 text-center
                            focus:outline-none focus:ring-2 focus:ring-studogrey/50
                            appearance-none"
          >
            <option value="all">{t("all")}</option>
            <option value="recent">{t("recent")}</option>
            <option value="created">{t("created")}</option>
          </select>
        </div>
        <div className="w-fit flex flex-row gap-5 items-center">
          <SetSearch sets={allSets} setSearchQuery={setSearchQuery} />
          <button
            onClick={togglePopUp}
            ref={containerRef}
            className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
          >
            <div className="absolute bg-blue-500/50 h-8 w-8 rounded-full blur-sm" />
            <div className="relative z-10 shadow-2xl bg-blue-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
              <IoIosAdd />
            </div>
            <AddPopUp
              AddIsOpen={AddIsOpen}
              setAddIsOpen={setAddIsOpen}
              containerRef={containerRef}
              toggleCreate={toggleCreate}
            />
          </button>
        </div>
      </div>
      <div className="w-full flex-1 h-fit gap-2 flex flex-col">
        {filteredSets.length === 0 ? (
          <div className="w-full h-fit flex-1 flex-col gap-2 flex dark:text-white text-studodarkblue font-bold items-center pt-40">
            <Image
              width={100}
              height={100}
              src={"/images/fallbacks/books.png"}
              alt=""
              className="h-30 w-30 opacity-50 saturate-0"
            />
            <div className={"flex flex-col items-center justify-center gap-2"}>
              <span className={"dark:text-white text-xl font-bold"}>
                {t("nothing_title")}
              </span>
              <p
                className={
                  "dark:text-studogrey text-gray-400 font-normal text-sm"
                }
              >
                {t("nothing_paragraph")}
              </p>
            </div>
          </div>
        ) : (
          <ListItems items={filteredSets} />
        )}
      </div>
    </div>
  );
}

interface AddPopupProps {
  AddIsOpen: boolean;
  setAddIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  toggleCreate: () => void;
}

const menuItems = [
  {
    to: "/create-studoset",
    icon: "/icons/studyset.svg",
    label: "create_ss",
    color: "from-emerald-400 to-teal-500",
  },
  {
    to: "/create-visualset",
    icon: "/icons/visualset.svg",
    label: "create_vs",
    color: "from-blue-400 to-indigo-500",
  },
];

function AddPopUp({ AddIsOpen, setAddIsOpen, containerRef }: AddPopupProps) {
  const t = useTranslations("header");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAddIsOpen(false);
      }
    };

    if (AddIsOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [AddIsOpen, setAddIsOpen, containerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-4
                z-[9999] w-55 p-2 truncate
                rounded-2xl
                bg-white/80 dark:bg-[#1e293b]/90
                backdrop-blur-xl
                border border-white/50 dark:border-white/10
                shadow-xl shadow-black/10 dark:shadow-black/30
                transition-all duration-300 ease-out origin-top
                ${
                  AddIsOpen
                    ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                }
            `}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                border-l border-t border-white/50 dark:border-white/10"
      />

      <div className="relative flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <Link
            key={item.to}
            href={item.to}
            onClick={() => setAddIsOpen(false)}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                            text-studodarkblue dark:text-white
                            hover:bg-gradient-to-r hover:${item.color} hover:text-white
                            transition-all duration-200 ease-out
                            ${AddIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `}
            style={{
              transitionDelay: AddIsOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg
                            bg-gradient-to-br ${item.color}
                            shadow-md shadow-black/10
                            group-hover:scale-110 group-hover:shadow-lg
                            transition-all duration-200`}
            >
              <Image
                width={20}
                height={20}
                src={item.icon}
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
            </div>

            <span className="font-medium text-sm dark:text-white text-studodarkblue">
              {t(item.label)}
            </span>

            <svg
              className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
