import CourseIcons from "../../../data/Index.js";
import { Link } from "react-router-dom";

export default function CourseItem({ course }) {
	return (
		<Link
			to={`/courses/${course.replace(" ", "-")}`}
			className="min-w-28 min-h-28 max-w-28 max-h-28
        sm:min-w-32 sm:min-h-32 sm:max-w-32 sm:max-h-32
        md:min-w-36 md:min-h-36 md:max-w-36 md:max-h-36
        lg:min-w-32 lg:min-h-32 lg:max-w-32 lg:max-h-32
        bg-studowhite gap-1.5 sm:gap-2 md:gap-3 border-1 border-transparent
        border-studoborder flex flex-col justify-center items-center
        rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
        p-4 sm:p-6 md:p-8 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        hover:scale-105 transition-transform flex-shrink-0"
		>
			<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-16 lg:h-16
        rounded-full flex items-center justify-center bg-studowhite p-1.5 sm:p-2 md:p-3">
				<img
					src={getCoverImage(course)}
					className="max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-14 min-h-10 sm:min-h-12 md:min-h-14 lg:min-h-12 w-auto"
					alt={course}
				/>
			</div>
			<span className="text-[10px] sm:text-xs md:text-sm text-center truncate max-w-full px-1">
        {course}
      </span>
		</Link>
	);
}

function getCoverImage(subject) {
	const Import = Object.keys(CourseIcons).find((key) =>
		subject.toLowerCase().includes(key)
	);
	if (!Import) {
		return "./src/assets/icons/courses/default.svg";
	}
	return "./src/assets/icons/courses/" + CourseIcons[Import];
}