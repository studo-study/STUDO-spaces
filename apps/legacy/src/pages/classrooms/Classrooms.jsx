import { useTranslation } from "react-i18next";
import Navbar from "./navbar/Navbar.jsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { useEffect, useState } from "react";
import plusIcon from "../../assets/icons/cross.png";
import AddSets from "./navbar/addsets/AddSets.jsx";
import CreateClassroom from "../classroom/createclassroom/CreateClassroom.jsx";

export default function Classrooms() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useSWR("users/me/classrooms");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id && !isLoading && data?.classrooms?.length > 0) {
      navigate(`/classrooms/${data.classrooms[0].id}`, { replace: true });
    }
  }, [id, isLoading, data, navigate]);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closePopup = () => setIsOpen(false);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-baseline pt-35">
      <div className="flex md:w-3/5 w-full flex-col items-center justify-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-row items-center justify-between">
          <span
            className="w-full text-4xl flex flex-col justify-center items-baseline font-semibold
          text-studodarkblue font-atrament dark:text-white"
          >
            {t("YOUR CLASSROOMS")}
          </span>

          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-emerald-400 opacity-45 blur-md z-[1] pointer-events-none" />
            <div
              onClick={toggleOpen}
              className="relative min-w-30 w-fit min-h-10 bg-emerald-400 rounded-full flex items-center justify-center cursor-pointer
                      active:scale-105 transition-transform z-[2] select-none gap-3
                      border-[0.5px] border-solid border-[#8181812f] border-t-emerald-300 border-l-emerald-300"
            >
              <img
                src={plusIcon}
                className="w-4 h-auto invert brightness-0"
                alt="Add"
              />
              <span className={"text-white font-atrament text-xl"}>
                {t("create").toUpperCase()}
              </span>
            </div>
            <CreateClassroom isOpen={isOpen} onClose={closePopup} />
          </div>
        </div>
        <Navbar data={data} isLoading={isLoading} />
        <Outlet />
      </div>
    </div>
  );
}
