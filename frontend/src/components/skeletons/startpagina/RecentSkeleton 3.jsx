export default function RecentSkeleton() {
	return (
		<div className="flex flex-col justify-start items-stretch
      bg-studowhite w-full
      h-auto min-h-60 sm:min-h-72 md:min-h-90
      gap-3 sm:gap-4
      border-[0.5px] border-solid border-studoborder
      rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
      p-4 sm:p-6 md:py-8 md:px-7
      backdrop-blur-xs
      dark:bg-gray-700
      dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      dark:border-[#8181812f] dark:border-t-studowhite dark:border-l-studowhite
      mb-6 sm:mb-8 md:mb-10
      animate-pulse">

			{/* Header skeleton */}
			<div className="w-full flex flex-row">
				<div className="h-5 sm:h-6 w-24 sm:w-28 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
			</div>

			{/* Grid of skeleton items */}
			<div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
				{[...Array(6)].map((_, index) => (
					<RecentItemSkeleton key={index} />
				))}
			</div>
		</div>
	);
}

function RecentItemSkeleton() {
	return (
		<div className="flex items-center bg-gray-100 dark:bg-gray-600
      w-full min-h-14 sm:min-h-16 md:min-h-18 max-h-18
      overflow-hidden justify-between rounded-full gap-2 p-2 px-2">

			<div className="flex flex-row gap-2 flex-1 min-w-0">
				{/* Avatar skeleton */}
				<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          rounded-full bg-gray-200 dark:bg-gray-500 flex-shrink-0">
				</div>

				{/* Text content skeleton */}
				<div className="flex w-full flex-col gap-1.5 sm:gap-2 justify-center min-w-0 pr-2">
					<div className="h-4 sm:h-5 md:h-6 bg-gray-200 dark:bg-gray-500 rounded-md w-3/4"></div>
					<div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-500 rounded-md w-1/2"></div>
				</div>
			</div>

			{/* Progress skeleton */}
			<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-500 flex-shrink-0"></div>
		</div>
	);
}