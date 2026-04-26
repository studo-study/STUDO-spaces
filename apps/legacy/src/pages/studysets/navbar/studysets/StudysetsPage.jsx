import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { t } from "i18next";
import StudysetItem from "./StudysetItem.jsx";
import plusIcon from "../../../../assets/icons/cross.png";
import CreatePopup from "../components/CreatePopup.jsx";

export default function StudysetsPage() {
  const selector = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((isOpen) => !isOpen);
  const closePopup = () => setIsOpen(false);

  const { data: sets, isLoading } = useSWR("users/me/studosets");
  const [sortedsets, setSortedsets] = useState([]);
  const [studysets, setStudysets] = useState([]);

  useEffect(() => {
    if (!isLoading && sets) {
      const allSets = [
        ...sets.studysets.map((set) => ({
          id: set.id,
          title: set.title,
          course: set.course,
          created_at: set.created_at,
          user_id: set.user_id,
          type: "studyset",
          displayName: set.displayName,
          img_url: set.img_url
        })),
        ...sets.visualsets.map((set) => ({
          id: set.id,
          title: set.title,
          course: set.course,
          created_at: set.created_at,
          user_id: set.user_id,
          type: "visualset",
          displayName: set.displayName,
          img_url: set.img_url
        }))
      ];
      setStudysets(allSets);
      setSortedsets(allSets);
    }
  }, [isLoading, sets]);

  const sortSets = () => {
    const value = selector.current.value;
    if (value === "all") {
      setSortedsets(studysets);
    } else {
      setSortedsets(studysets.filter((s) => s.type === value));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 sm:gap-4">
      <div className="w-full h-fit flex flex-row items-center justify-end gap-2 sm:gap-3 py-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-studoblue opacity-45 blur-md z-[1] pointer-events-none" />
          <div
            onClick={toggleOpen}
            className="relative w-10 h-10 bg-studoblue rounded-full flex items-center justify-center cursor-pointer
              active:scale-105 transition-transform z-[2] select-none
              border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300">
            <img src={plusIcon} className="w-5 h-auto" alt="Add" />
          </div>
          <CreatePopup isOpen={isOpen} onClose={closePopup} />
        </div>

        <select
          ref={selector}
          name="sort sets"
          defaultValue="all"
          className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
            border border-studogrey/30
            bg-white dark:bg-gray-700
            text-studodarkblue dark:text-white
            font-medium text-xs sm:text-sm
            shadow-sm hover:shadow-md
            transition-all duration-200
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-studogrey/50
            appearance-none
            bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==')]
            bg-[length:10px] bg-[center_right_8px] bg-no-repeat
            pr-7 text-center"
          onChange={sortSets}>
          <option value="all">{t("all sets")}</option>
          <option value="studyset">{t("studysets")}</option>
          <option value="visualset">{t("visualsets")}</option>
        </select>
      </div>

      <div className="w-full">
        {!isLoading && sortedsets.length === 0 ? (
          <div className="w-full mt-3 h-40 flex justify-center items-center text-sm sm:text-base">
            {t("no sets yet")}
          </div>
        ) : (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {!isLoading && sortedsets.map((set) => (
              <StudysetItem key={set.id} set={set} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}