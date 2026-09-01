import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IoIosClose } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { mockFullStudysets } from "@/data/mocks/startPageMock";
import SetItem from "@/components/ui/app/private/classroom/header/SetItem";
import { FullClassroomSet, FullStudyset } from "@/types/types";

interface InvitePeopleProps {
  addOpen: boolean;
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const userSets: FullStudyset[] = mockFullStudysets;

export default function AddSet({ addOpen, setAddOpen }: InvitePeopleProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("classroom.addset");
  const [importedClassrooms, setImportedClassrooms] = useState<
    FullClassroomSet[]
  >([]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setAddOpen(false);
      }
    };

    if (addOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addOpen, setAddOpen, popupRef]);

  useEffect(() => {
    if (addOpen) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [addOpen]);

  return (
    <div
      className={`fixed inset-0 flex items-baseline justify-center pt-70 w-full bg-black/50 h-full z-[9999] ${addOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        ref={popupRef}
        className={`w-1/4 min-h-135
                      z-[9999] p-2 truncate rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
      transition-all duration-300 ease-out origin-top px-7 py-10 flex flex-col gap-3 justify-between items-center
      ${
        addOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-5" + "" + ""
      }`}
      >
        <div
          className={
            "w-full flex px-2 py-2 dark:text-white text-4xl text-studodarkblue items-center justify-end absolute top-0 left-0 z-10"
          }
        >
          <div
            className={
              "h-8 w-8 rounded-full hover:bg-studogrey transition-all duration-300 justify-center items-center cursor-pointer active:scale-95 flex"
            }
          >
            <IoIosClose
              onClick={() => {
                setAddOpen(false);
              }}
            />
          </div>
        </div>
        <div className={"w-full h-fit flex flex-col gap-7"}>
          <div className="flex items-center justify-baseline text-lg px-2 dark:text-white text-studodarkblue">
            <IoAddCircleOutline />
            <span className="w-full text-lg select-none sm:text-xl md:text-2xl px-2 sm:px-5 font-bold text-studodarkblue dark:text-white">
              {t("title")}:
            </span>
          </div>

          <div className={"w-full h-80 flex flex-col gap-3 overflow-y-auto"}>
            {userSets.map((u, i) => (
              <SetItem
                importedClassrooms={importedClassrooms}
                setImportedClassrooms={setImportedClassrooms}
                set={u}
                key={i}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={importedClassrooms.length === 0}
            className={`disabled:opacity-60 disabled:active:scale-100 disabled:cursor-not-allowed bg-gradient-to-br from-emerald-400 to-green-500 w-full cursor-pointer h-12 text-xl text-white border-neutral-200 border
                    rounded-4xl font-bold active:scale-95 transition-all duration-300 shadow-3xl`}
          >
            {importedClassrooms.length === 1 ? t("button_e") : t("button_m")}
          </button>
        </div>
      </div>
    </div>
  );
}
