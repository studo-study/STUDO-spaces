export default function CoursesSkeleton() {
	return (
		<div className="relative w-full mt-3 sm:mt-4 md:mt-7 animate-pulse">
			<div className="w-full flex-row flex justify-baseline items-center
        rounded-2xl sm:rounded-4xl min-h-fit
        flex-nowrap overflow-x-auto scroll-hidden
        gap-3 sm:gap-4
        border-1 border-transparent border-studoborder
        p-4 sm:p-5 md:p-7 backdrop-blur-xs
        border-[0.5px] border-solid">
				{[...Array(4)].map((_, index) => (
					<CourseItemSkeleton key={index} />
				))}
			</div>

			<div className="absolute left-0 top-0 bottom-0 w-3 sm:w-5 md:w-8
        bg-gradient-to-r from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-l-2xl sm:rounded-l-4xl"></div>

			<div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 md:w-15
        bg-gradient-to-l from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-r-2xl sm:rounded-r-4xl"></div>
		</div>
	);
}

function CourseItemSkeleton() {
	return (
		<div className="min-w-32 min-h-32 max-w-32 max-h-32
      sm:min-w-36 sm:min-h-36 sm:max-w-36 sm:max-h-36
      md:min-w-40 md:min-h-40 md:max-w-40 md:max-h-40
      bg-studowhite gap-2 sm:gap-3 border-1 border-transparent
      border-studoborder flex flex-col justify-center items-center
      rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
      p-6 sm:p-8 md:p-10 backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      flex-shrink-0">

			{/* Icon circle skeleton */}
			<div className="w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22
        rounded-full bg-gray-200 dark:bg-gray-500">
			</div>

			{/* Label skeleton */}
			<div className="h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-gray-200 dark:bg-gray-500 rounded-md"></div>
		</div>
	);
}