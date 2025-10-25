import Courses from './courses/Courses.jsx';
import Recent from './recent/Recent.jsx';
import left from '../../assets/icons/left.svg';
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function StartingPagina() {
	//variables
	const { t, i18n } = useTranslation();
	//return statement
  return (
	  <div className="w-full flex flex-col items-center justify-center pt-35">
		<div className="flex w-3/5 flex-col items-center justify-center gap-3">
			<Link to="/studysets/studysets"
			   className="flex flex-row gap-2 items-center justify-start text-studodarkblue
    dark:text-white font-atrament text-xl w-full">
				{t("SETS")}
				<img src={left}
					 className="rotate-180 h-8 dark:invert dark:brightness-0"/>
			</Link>
			<Courses/>
			<Link to="/courses"
			   className="flex flex-row gap-2 items-center justify-start text-studodarkblue
    dark:text-white font-atrament text-xl w-full">
				{t("COURSES")}
				<img src={left}
					 className="rotate-180 h-8 dark:invert dark:brightness-0"/>
			</Link>
			<Recent/>
		</div>
	  </div>
  );
}