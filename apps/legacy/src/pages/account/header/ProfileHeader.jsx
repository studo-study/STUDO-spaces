import Profile from "../profilepicture/ProfilePicutre.jsx";
import Joined from "../../components/joined/Joined.jsx";
import { Link } from "react-router-dom";
import Streak from "../../components/streak/Streak.jsx";
import Cal from "../../../assets/icons/calendar.svg";
import { t } from "i18next";

export default function ProfileHeader({ user }) {
  const lang = localStorage.getItem("i18nextLng");

  const date = new Date(user.join_date);

  const formattedDate = date.toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="flex flex-col sm:flex-row justify-start sm:justify-baseline items-start sm:items-center
      bg-studowhite min-h-fit sm:min-h-32 w-full gap-3 sm:gap-5 border-1 border-transparent
      border-studoborder rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs p-3 sm:p-4
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
    >
      <Profile img={user.img_url} />
      <div className="flex flex-col gap-2 sm:gap-3 w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-baseline sm:items-center flex-wrap">
          <span
            className="flex items-center text-xl sm:text-2xl
                font-sfpro font-bold text-studodarkblue dark:text-white break-all"
          >
            {user.displayName}
          </span>
          <Joined number={user.joinNumber} />
          {user.streak_count < 3 ? (
            ""
          ) : (
            <Link to="/streak">
              <Streak streak={user.streak_count} />
            </Link>
          )}
        </div>
        <div className="flex flex-row justify-start items-center gap-2 sm:gap-3 flex-wrap">
          <img
            className="h-4 sm:h-5 dark:brightness-0 dark:invert"
            src={Cal}
            alt="calendar icon"
          />
          <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
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
