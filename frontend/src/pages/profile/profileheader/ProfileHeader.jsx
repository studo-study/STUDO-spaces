import Cal from "../../../../public/assets/icons/calendar.svg";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState } from "react";
import Streak from "../../components/streak/Streak.jsx";
import Joined from "../../components/joined/Joined.jsx";

export default function ProfileHeader({ profile }) {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);

  const lang = localStorage.getItem("i18nextLng") || "nl-NL-NL";
  const date = new Date(profile.join_date);

  const formattedDate = date.toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="flex flex-col mt-10 md:mt-0 sm:flex-row justify-start sm:justify-baseline items-center md:items-start
      bg-studowhite min-h-fit sm:min-h-32 w-full gap-3 sm:gap-5 border-1 border-transparent
      border-studoborder rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs p-3 sm:p-4
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
      <div className="flex justify-center items-center w-full h-full md:w-fit md:h-fit">
        <div className="bg-green-300 rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22
        overflow-hidden flex-shrink-0">
          <img src={profile.img_url} alt={profile.displayName} className="w-full h-full object-cover" />
        </div>
      </div>

      <div
        className="flex flex-col gap-2 sm:gap-3 w-full min-w-0 items-center justify-center md:items-baseline md:justify-center">
        <div className="flex flex-row sm:flex-row gap-2 sm:gap-3 items-start sm:items-center flex-wrap">
          <span className="flex items-center text-xl sm:text-2xl
            font-sfpro font-bold text-studodarkblue dark:text-white break-words">
            {profile.displayName}
          </span>
          <div className={"flex flex-row "}>
            <Joined number={profile.joinNumber} />
            <Streak streak={profile.streak} />
          </div>

        </div>
        <div className="flex flex-row justify-start items-center gap-2 sm:gap-3 flex-wrap">
          <img className="h-4 sm:h-5 dark:brightness-0 dark:invert flex-shrink-0" src={Cal} alt="calendar icon" />
          <span className="text-studodarkblue dark:text-white text-xs sm:text-sm md:text-base">
            {t("Joined")}:{datumFormatter(formattedDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

function datumFormatter(date) {
  return ` ${date}`;
}