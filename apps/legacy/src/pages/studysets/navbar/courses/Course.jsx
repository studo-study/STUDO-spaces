import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import StudysetItem from "../studysets/StudysetItem.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

export default function Course() {
  const selector = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sets, isLoading } = useSWR("users/me/course/" + id);
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

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 sm:gap-4">
      <div className="w-full h-fit flex flex-row items-center justify-start gap-3 sm:gap-5 py-3">
        <div
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full
            flex items-center justify-center border border-studogrey/30
            bg-white dark:bg-gray-700
            text-studodarkblue dark:text-white
            font-medium text-sm
            shadow-sm hover:shadow-md
            transition-all duration-200
            cursor-pointer
            focus:outline-none active:scale-105 z-[2] select-none focus:ring-2 focus:ring-studogrey/50"
          onClick={handleNavigate}>
          <FaChevronLeft className="text-xs sm:text-sm" />
        </div>
        <span className="text-lg sm:text-xl md:text-2xl font-bold truncate">
          {!isLoading && sets && id}
        </span>
      </div>

      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {!isLoading && sortedsets.map((set) => (
          <StudysetItem key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}