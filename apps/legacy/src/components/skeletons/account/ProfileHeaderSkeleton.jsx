export default function ProfileHeaderSkeleton() {
  return (
    <div
      className="flex flex-row justify-baseline items-center
			  bg-studowhite min-h-32 w-full gap-5 border-1 border-transparent
			  border-studoborder rounded-4xl
			  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs p-4
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
    >
      <div className="bg-studogrey rounded-full h-22 w-22 cursor-pointer animate-pulse"></div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-baseline items-center">
          <span
            className="flex items-center text-2xl
              font-sfpro font-bold text-studodarkblue dark:text-white"
          ></span>
          <div className="animate-pulse bg-studogrey rounded-lg min-h-5 min-w-30"></div>
        </div>
        <div className="animate-pulse bg-studogrey rounded-lg min-h-5 min-w-50"></div>
      </div>
    </div>
  );
}
