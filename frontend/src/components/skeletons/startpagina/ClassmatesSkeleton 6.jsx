export default function ClassmatesSkeleton() {
	return (
		<div className="w-full mt-3 sm:mt-4 md:mt-7 animate-pulse">
			<div className="flex justify-around items-baseline flex-col
        bg-studowhite min-h-32 sm:min-h-36 md:min-h-40 max-h-fit w-full gap-2
        border-1 border-transparent border-studoborder rounded-2xl sm:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        mb-6 sm:mb-8 md:mb-10
        border-[0.5px] border-solid
        dark:border-t-gray-500 dark:border-l-gray-500 grid-flow-col
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        grid grid-cols-1 sm:grid-cols-2 auto-rows-min">
				{[...Array(4)].map((_, index) => (
					<ClassmateItemSkeleton key={index} />
				))}
			</div>
		</div>
	);
}

function ClassmateItemSkeleton() {
	return (
		<div className="flex items-center bg-gray-100 dark:bg-gray-600
      w-full min-h-12 sm:min-h-14 md:min-h-15 max-h-15
      overflow-hidden justify-between rounded-full gap-2 sm:gap-3 p-2 px-2">

			{/* Avatar skeleton */}
			<div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
        rounded-full bg-gray-200 dark:bg-gray-500 flex-shrink-0">
			</div>

			{/* Content skeleton */}
			<div className="grid grid-cols-1 w-full min-w-0 pr-2 sm:pr-3 md:pr-5">
				<div className="w-full flex flex-col gap-1.5">
					<div className="w-full flex flex-row justify-between items-center gap-2">
						<div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-500 rounded-md w-20 sm:w-24"></div>
						<div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-500 rounded-md w-10 sm:w-12 flex-shrink-0"></div>
					</div>
					<div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-500 rounded-md w-28 sm:w-32"></div>
				</div>
			</div>
		</div>
	);
}