import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Studyset from "../../../../assets/icons/studyset.svg";
import Visualset from "../../../../assets/icons/visualset.svg";
import SetItem from "./SetItem.jsx";
import { IoMdClose } from "react-icons/io";
import useSWRMutation from "swr/mutation";
import { save } from "../../../../api/index.js";

export default function AddSets({ isOpen, onClose, classsets, classroom }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  const { data: sets, isLoading } = useSWR("users/me/studosets");
  const { trigger: triggerImport } = useSWRMutation(`classrooms/${classroom}/sets/add`, save);

  const [sortedsets, setSortedsets] = useState([]);
  const [studysets, setStudysets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleSetSelection = (setId) => {
    setSelectedSets(prev => {
      if (prev.includes(setId)) {
        return prev.filter(id => id !== setId);
      } else {
        return [...prev, setId];
      }
    });
  };

  const handleImporteren = async () => {
    if (selectedSets.length === 0) {

      return;
    }

    const body = { sets: selectedSets };

    try {
      await triggerImport(body);
      setSelectedSets([]);
      onClose();
    } catch (error) {
    }
  };

  return (
    <div
      ref={popupRef}
      className={`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2
        w-[95%] sm:w-[85%] md:w-[70%] lg:w-1/2 xl:w-1/3
        h-[85vh] sm:h-4/5 min-w-fit
        z-[9999] flex flex-col items-center gap-3 sm:gap-4 md:gap-5
        font-akira text-xl sm:text-2xl font-semibold text-[#2a3a42]
        rounded-2xl sm:rounded-3xl border border-white/30 
        p-4 px-6 sm:p-5 sm:px-8 md:px-10
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 ease-in-out origin-top
        ${isOpen
        ? "opacity-100 scale-100 visible pointer-events-auto"
        : "opacity-0 scale-95 invisible pointer-events-none"}
      `}>

      <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-3 w-full h-fit gap-2 items-center">
        <div></div>
        <span className="font-atrament text-lg sm:text-2xl md:text-3xl dark:text-white text-center">
          {t("add studysessions").toUpperCase()}
        </span>
        <div className="w-full flex items-center justify-end">
          <IoMdClose
            color="white"
            size={24}
            onClick={onClose}
            className="cursor-pointer sm:w-[30px] sm:h-[30px]"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <Link to="/create-set" className="w-full min-w-fit overflow-hidden">
          <div className="flex items-center w-full p-3 px-4 sm:p-4 sm:px-5
            font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey gap-2
            cursor-pointer select-none transition-transform duration-300 ease-out">
            <img src={Studyset} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
            <span className="font-sfpro text-sm sm:text-base dark:text-white truncate">
              {t("Create new studoset")}
            </span>
          </div>
        </Link>

        <Link to="/create-visualset" className="w-full min-w-fit overflow-hidden">
          <div className="flex items-center w-full p-3 px-4 sm:p-4 sm:px-5
            font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey gap-2
            cursor-pointer select-none transition-transform duration-300 ease-out">
            <img src={Visualset} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
            <span className="font-sfpro text-sm sm:text-base dark:text-white truncate">
              {t("Create new ((visualset))")}
            </span>
          </div>
        </Link>
      </div>

      <div className="w-full h-full flex flex-col overflow-y-auto scroll-hidden gap-2 sm:gap-3">
        {!isLoading && sortedsets.map((set) => {
          const isDisabled = classsets.some((cs) => cs.set_id === set.id);
          const isSelected = selectedSets.includes(set.id);

          return (
            <SetItem
              key={set.id}
              set={set}
              isDisabled={isDisabled}
              isSelected={isSelected}
              onToggle={() => toggleSetSelection(set.id)}
            />
          );
        })}
      </div>

      <div
        onClick={handleImporteren}
        className="inline-flex flex-row items-center justify-center p-2 sm:p-3
          font-atrament font-bold text-base sm:text-lg md:text-xl text-[#2a3a42]
          w-full sm:w-2/3 md:w-1/2 lg:w-1/3
          rounded-full bg-studoblue cursor-pointer select-none
          border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
          dark:text-white hover:opacity-80 transition-opacity">
        {t("import").toUpperCase()}
      </div>
    </div>
  );
}