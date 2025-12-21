import CourseItem from "./CourseItem.jsx";
import More from "./More.jsx";
import {t} from "i18next";

export default function Courses({courses}) {
	return (
		<div className="relative w-full mt-3 sm:mt-4 md:mt-7">
			{courses.length === 0 ? (
				<div className="w-full h-32 sm:h-36 md:h-40 p-3 justify-center items-center flex text-sm sm:text-base">
					{t("no courses yet")}
				</div>
			) : (
				<div className="w-full flex-row flex justify-baseline items-center
          rounded-2xl sm:rounded-4xl min-h-fit
          flex-nowrap overflow-x-auto scroll-hidden
          gap-3 sm:gap-4
          border-1 border-transparent border-studoborder
          p-4 sm:p-5 md:p-7 backdrop-blur-xs
          border-[0.5px] border-solid">
					{courses.map((course, index) => (
						<CourseItem key={index} course={course}/>
					))}
					{courses.length > 0 && <More/>}
				</div>
			)}

			<div className="absolute left-0 top-0 bottom-0 w-3 sm:w-5 md:w-8
        bg-gradient-to-r from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-l-2xl sm:rounded-l-4xl"></div>

			<div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 md:w-15
        bg-gradient-to-l from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-r-2xl sm:rounded-r-4xl"></div>
		</div>
	);
}