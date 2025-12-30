import { useLocation, useNavigate, useParams } from "react-router-dom";
import Members from "./members/Members.jsx";
import { useTranslation } from "react-i18next";
import useSWR, { mutate } from "swr";
import Classroomset from "./sets/Classroomset.jsx";
import { useEffect, useState } from "react";
import { del, save } from "../../api/index.js";
import { useAuth } from "../../contexts/auth.js";
import AddSets from "../classrooms/navbar/addsets/AddSets.jsx";
import plusIcon from "../../assets/icons/cross.png";
import useSWRMutation from "swr/mutation";

export default function Classroom() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaving, setLeaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { trigger: triggerJoin } = useSWRMutation(`classrooms/${id}/users`, save);
  const { trigger: triggerLeave } = useSWRMutation(`classrooms/${id}/users/me`, del);
  const { data: classroom = {}, isLoading, error } = useSWR(`classrooms/${id}`);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closePopup = () => setIsOpen(false);

  useEffect(() => {
    if (isLoading || !classroom?.users || !user?.id) return;
    const isJoined = classroom.users.some(u => u.user_id === user.id);
    setJoined(isJoined);
  }, [isLoading, classroom, user]);

  const handleJoin = async () => {
    try {
      await triggerJoin({ classroom_id: id, role: "student" });
      setJoining(true);
      setTimeout(() => {
        mutate(`classrooms/${id}`);
        navigate("/classrooms");
        setJoining(false);
      }, 500);
      setTimeout(() => setJoining(false), 2000);
    } catch (err) {
    }
  };

  const handleLeave = async () => {
    try {
      await triggerLeave({});
      setLeaving(true);
      setTimeout(() => {
        mutate(`classrooms/${id}`);
        navigate(`/classroom/${id}`);
      }, 1000);
      setTimeout(() => setLeaving(false), 3000);
    } catch (err) {
    }
  };

  const handleDelete = async (set_id) => {
    try {
      await del(`classrooms/${id}/sets/${set_id}`, {});
      mutate(`classrooms/${id}`);
    } catch (err) {
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 sm:gap-8 md:gap-10">
      {!isLoading && !joined && (
        <div
          className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
          <span className="w-full text-xl sm:text-2xl font-bold break-words">{classroom.name}</span>
          <button
            className="w-full sm:w-auto min-w-fit px-4 sm:px-7 py-3 sm:py-0 h-12 sm:h-10
              bg-studoblue rounded-full flex items-center justify-center cursor-pointer
              active:scale-105 transition-transform z-[2] select-none font-atrament text-sm sm:text-lg
              border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300"
            onClick={handleJoin}>
            {joining ? t("joning...").toUpperCase() : t("join classroom").toUpperCase()}
          </button>
        </div>
      )}

      <div className="w-full h-full flex flex-col lg:flex-row gap-5">
        <div
          className="w-full lg:w-3/5 h-max flex flex-col gap-3 sm:gap-4 md:gap-5 justify-baseline items-baseline">
          <div className="w-full h-fit flex flex-row justify-between items-center">
            <span className="text-base sm:text-lg text-studobarkblue dark:text-white font-bold">
              {t("Studysets")}:
            </span>
            <div>
              {!isLoading && joined && (
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-lg bg-studoblue opacity-45 blur-md z-[1] pointer-events-none" />
                  <div
                    onClick={toggleOpen}
                    className="relative w-10 h-10 bg-studoblue rounded-full flex items-center justify-center cursor-pointer
                      active:scale-105 transition-transform z-[2] select-none
                      border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300">
                    <img src={plusIcon} className="w-5 h-auto" alt="Add" />
                  </div>
                  <AddSets
                    isOpen={isOpen}
                    onClose={closePopup}
                    classsets={classroom.sets}
                    classroom={id}
                  />
                </div>
              )}
            </div>
          </div>

          {!isLoading && classroom && (
            <Classroomset
              isLoading={isLoading}
              sets={classroom.sets}
              toggleDelete={handleDelete}
            />
          )}
          {!isLoading && classroom?.sets?.length === 0 && (
            <span
              className="w-full h-fit flex pt-6 sm:pt-10 items-center justify-center text-sm sm:text-base">
              {t("no sets in this classroom")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full lg:w-2/5">
          {!isLoading && classroom && (
            <Members isLoading={isLoading} members={classroom.users} />
          )}
          {!isLoading && joined && (
            <button disabled={classroom.users.length === 1}
                    className={`font-semibold gap-2 px-4 sm:px-7 py-3 cursor-pointer
                dark:text-white text-studodarkblue inline-flex flex-row
                items-center justify-center font-atrament text-base sm:text-xl
                rounded-full bg-red-500/30 select-none
                border-[0.5px] border-red-300/50 disabled:opacity-50 disabled:pointer-events-none
                hover:bg-red-800 transition-all duration-300`}
                    onClick={handleLeave}>
              {leaving ? t("leaving classroom...").toUpperCase() : t("leave classroom").toUpperCase()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}