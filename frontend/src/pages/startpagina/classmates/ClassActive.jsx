import { Link } from "react-router-dom";
import { t } from "i18next";

export default function ClassActive({ classMate }) {
  const user = classMate;

  return (
    <div className="flex items-center bg-studogrey shadow-md border-solid border-2 border-studogrey
      select-none transition-transform duration-300 ease-out
      w-full min-h-12 sm:min-h-14 md:min-h-15 max-h-15
      overflow-hidden justify-between rounded-full gap-2 sm:gap-3 p-2 px-2 bg-studoblue">
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative text-studodarkblue flex-shrink-0">
        {checkActivity(user.last_seen) && (
          <div
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 absolute z-[999] rounded-full bg-studoblue right-0 top-0"></div>
        )}
        <div className="w-full h-full rounded-full overflow-hidden bg-amber-300">
          <img src={user.img_url} alt={user.displayName} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 w-full min-w-0 pr-2 sm:pr-3 md:pr-5">
        <div className="w-full flex flex-col gap-0.5">
          <div className="w-full flex flex-row justify-between items-center gap-2">
            <Link
              to={`/profile/${user.user_id}`}
              className="font-bold hover:underline truncate text-xs sm:text-sm md:text-base">
              {user.displayName}
            </Link>
            <span
              className="text-[10px] sm:text-xs text-studodarkblue/50 dark:text-white/50 whitespace-nowrap flex-shrink-0">
              {calcTime(user.last_seen)}
            </span>
          </div>
          <div className="w-full flex flex-row items-center justify-baseline gap-1
            text-studodarkblue/50 dark:text-white/50 text-[10px] sm:text-xs">
            <Link
              to={user.set_type === "studyset" ? `/studyset/${user.set_id}` : `/visualset/${user.set_id}`}
              className="hover:underline truncate text-studodarkblue/50 dark:text-white/50">
              {user.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function checkActivity(lastActive) {
  const date = Date.now();
  const nu = new Date(lastActive).getTime();
  return (date - nu) < 2000;
}

function calcTime(activity) {
  const now = Date.now();
  const lastActive = new Date(activity).getTime();
  const diff = (now - lastActive) / 1000;

  if (diff < 120) return t("now");
  if (diff < 300) return t("5 min");
  if (diff < 600) return t("10 min");
  if (diff < 1200) return t("20 min");
  if (diff < 1800) return t("30 min");
  if (diff < 3600) return t("1 hr");
  if (diff < 7200) return t("2 hrs");
  if (diff < 86400) return t("1 d");
  if (diff < 172800) return t("2 d");
  return t("older");
}