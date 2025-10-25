import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

export default function Members({ members }) {
	const { t, i18n } = useTranslation();
  return (
    <div className="w-full h-6/7 bg-green
    flex flex-col justify-center items-baseline bg-studowhite
    gap-5 border-1 border-transparent border-studoborder rounded-4xl
    shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-5 backdrop-blur-xs
    dark:text-white text-studodarkblue
	dark:bg-gray-700  dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
	  border-[0.5px] border-solid
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
		<span className="font-bold">{t("Members")}:</span>
			<ul className="flex rouned-4xl flex-col gap-3 w-full h-max overflow-y-scroll scroll-hidden">
				{members.map((member) => {
					return <Link to={`/profile/${member.id}`}>
						<li className="flex flex-row bg-studogrey justify-baseline w-full items-center gap-3 p-2 border-solid border-2 rounded-4xl border-studogrey">
							<div className="h-10 w-10 rounded-full bg-green-300"></div>{member.firstName} {member.lastName}</li>
					</Link>
				})}
			</ul>
    </div>
  );
}