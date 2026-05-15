import plusIcon from "../../assets/icons/cross.png";
import Dots from "../../assets/icons/3dots.svg";
import FolderItem from "../studysets/navbar/folders/FolderItem.jsx";
import { FaChevronLeft } from "react-icons/fa";
import useSWR from "swr";
import StudysetItem from "../studysets/navbar/studysets/StudysetItem.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Folders() {
  const { id } = useParams();
  const { data: folder, isLoading, error } = useSWR(`folders/me/${id}`);
  const [sortedsets, setSortedsets] = useState([]);
  const [studysets, setStudysets] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && folder?.sets) {
      const allSets = [
        ...(folder.sets.studysets || []).map((set) => ({
          id: set.id,
          title: set.title,
          course: set.course,
          created_at: set.created_at,
          user_id: set.user_id,
          type: "studyset",
          displayName: set.displayName,
          img_url: set.img_url,
        })),
        ...(folder.sets.visualsets || []).map((set) => ({
          id: set.id,
          title: set.title,
          course: set.course,
          created_at: set.created_at,
          user_id: set.user_id,
          type: "visualset",
          displayName: set.displayName,
          img_url: set.img_url,
        })),
      ];
      setStudysets(allSets);
      setSortedsets(allSets);
    }
  }, [isLoading, folder]);

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
    <div className={"w-full h-full flex flex-col"}>
      <div
        className={
          "w-full h-20 flex flex-row items-center justify-baseline gap-5"
        }
      >
        <div
          className={
            "h-10 w-10 rounded-full flex items-center justify-center border border-studogrey/30\n" +
            "    bg-white dark:bg-gray-700\n" +
            "    text-studodarkblue dark:text-white\n" +
            "    font-medium text-sm\n" +
            "    shadow-sm hover:shadow-md\n" +
            "    transition-all duration-200\n" +
            "    cursor-pointer\n" +
            "    focus:outline-none active:scale-105 transition-transform z-[2] select-none focus:ring-2 focus:ring-studogrey/50"
          }
          onClick={handleNavigate}
        >
          <FaChevronLeft />
        </div>
        <span className={"text-2xl font-bold"}>
          {!isLoading && folder && folder.name}
        </span>
      </div>
      <div className={"w-full h-full grid grid-cols-3 grid-rows-auto gap-3"}>
        {!isLoading &&
          sortedsets.map((set) => <StudysetItem key={set.id} set={set} />)}
      </div>
    </div>
  );
}
