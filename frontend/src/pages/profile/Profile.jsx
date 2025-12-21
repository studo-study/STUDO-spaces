import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import ProfileHeader from "./profileheader/ProfileHeader.jsx";
import Studoheader from "./studoheader/Studoheader.jsx";
import { useAuth } from "../../contexts/auth.js";

export default function Profile() {
  const DeleteBtn = useRef(null);
  const LogOutBtn = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: Profile, isLoading, error } = useSWR(`profiles/${id}`);

  useEffect(() => {
    if (Profile && Profile.profile.id === user.id) {
      navigate("/account");
    }
  }, [Profile, user, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-studodarkblue dark:text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  if (!Profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-studodarkblue dark:text-white">No profile found</div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div
        className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5">

        <ProfileHeader profile={Profile.profile} />


        <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 sm:gap-3 px-3 sm:px-5 md:px-7">
              <NavLink
                to="studysets"
                className={({ isActive }) =>
                  `min-w-16 sm:min-w-20 text-sm sm:text-base ${isActive ? "font-bold" : "opacity-50"}`
                }>
                {t("studysets")}
              </NavLink>
              <span className="text-sm sm:text-base">|</span>
              <NavLink
                to="visualsets"
                className={({ isActive }) =>
                  `min-w-16 sm:min-w-20 text-sm sm:text-base ${isActive ? "font-bold" : "opacity-50"}`
                }>
                {t("visualsets")}
              </NavLink>
            </div>
          </div>

          <Outlet context={{
            studysets: Profile.studysets,
            visualsets: Profile.visualsets
          }} />

          <div className="w-full h-10 flex flex-row justify-end items-center">
            <div className="text-studodarkblue dark:text-white cursor-pointer text-sm sm:text-base">
              {t("all sets")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}