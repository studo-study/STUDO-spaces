export default function CourseItemSkeleton() {
	return (
		<div className="min-w-32 min-h-32 max-w-32 max-h-32
        sm:min-w-36 sm:min-h-36 sm:max-w-36 sm:max-h-36
        md:min-w-40 md:min-h-40 md:max-w-40 md:max-h-40
        bg-studowhite gap-2 sm:gap-3 border-1
        border-studoborder flex flex-col justify-center items-center
        rounded-2xl sm:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
        p-6 sm:p-8 md:p-10 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        hover:scale-105 transition-transform flex-shrink-0">
			<div className="min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 md:min-w-22 md:min-h-22
        rounded-full flex items-center justify-center bg-studowhite animate-pulse"></div>
		</div>
	)
}