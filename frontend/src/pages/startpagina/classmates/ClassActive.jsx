import { Link } from "react-router-dom";
import { t } from "i18next";

export default function ClassActive({ classMate }) {
	const user = classMate;

	return (
		<div className="flex items-center bg-studogrey shadow-md border-solid border-2 border-studogrey
      select-none transition-transform duration-300 ease-out
      w-full h-11 sm:h-12 md:h-14 lg:h-13
      overflow-hidden justify-between rounded-full gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 bg-studoblue">

			{/* Avatar with activity indicator */}
			<div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 relative text-studodarkblue flex-shrink-0">
				{checkActivity(user.last_seen) && (
					<div className="w-2 h-2 sm:w-2.5 sm:h-2.5 absolute z-[999] rounded-full bg-studoblue right-0 top-0"></div>
				)}
				<div className="w-full h-full rounded-full overflow-hidden bg-amber-300">
					<img src={user.img_url} alt={user.displayName} className="w-full h-full object-cover" />
				</div>
			</div>

			{/* Content */}
			<div className="grid grid-cols-1 w-full min-w-0 pr-1.5 sm:pr-2 md:pr-4">
				<div className="w-full flex flex-col gap-0">
					<div className="w-full flex flex-row justify-between items-center gap-1.5 sm:gap-2">
						<Link
							to={`/profile/${user.user_id}`}
							className="font-bold hover:underline truncate text-[11px] sm:text-xs md:text-sm leading-tight"
						>
							{user.displayName}
						</Link>
						<span className="text-[9px] sm:text-[10px] md:text-xs text-studodarkblue/50 dark:text-white/50 whitespace-nowrap flex-shrink-0">
              {calcTime(user.last_seen)}
            </span>
					</div>
					<div className="w-full flex flex-row items-center justify-baseline gap-1
            text-studodarkblue/50 dark:text-white/50 text-[9px] sm:text-[10px] md:text-xs">
						<Link
							to={user.set_type === "studyset" ? `/studyset/${user.set_id}` : `/visualset/${user.set_id}`}
							className="hover:underline truncate text-studodarkblue/50 dark:text-white/50"
						>
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