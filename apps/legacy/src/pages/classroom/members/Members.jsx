import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Members({ members, isLoading }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-h-96 sm:max-h-[500px] min-h-fit
      flex flex-col justify-center items-baseline bg-studowhite
      gap-3 sm:gap-4 md:gap-5 border-1 border-transparent border-studoborder
      rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 sm:p-4 md:p-5 backdrop-blur-xs
      dark:text-white text-studodarkblue
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
      <span className="font-bold text-base sm:text-lg">{t("Members")}:</span>
      <ul className="flex flex-col gap-2 sm:gap-3 w-full h-full overflow-y-auto scroll-hidden">
        {!isLoading && members && members.map((member) => (
          <Link key={member.user_id} to={`/profile/${member.user_id}`}>
            <li className="flex flex-row bg-studogrey justify-start w-full items-center
              gap-2 sm:gap-3 p-2 border-solid border-2 rounded-2xl sm:rounded-4xl border-studogrey
              hover:bg-studogrey/80 transition-colors">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-300 overflow-hidden flex-shrink-0">
                <img src={member.img_url} alt={member.displayName} className="w-full h-full object-cover" />
              </div>
              <span className="hover:underline text-sm sm:text-base truncate">
                {member.displayName}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}