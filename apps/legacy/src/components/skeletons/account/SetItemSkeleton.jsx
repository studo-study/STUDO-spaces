export default function SetItemSkeleton() {
  return (
    <div
      className="flex justify-between min-w-full min-h-20 max-h-20 rounded-full
  bg-studowhite border-transparent border-studoborder
     shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 backdrop-blur-xs
     flex-row w-1/3 h-10
     dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
    >
      <div className="flex items-center justify-between items-center gap-5">
        <div className="w-14 h-14 dark:bg-studogrey animate-pulse rounded-full bg-white flex justify-center items-center"></div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold min-h-5 min-w-30 bg-studogrey rounded-lg "></span>
          <div className="flex flex-row gap-3 items-center">
            <div className="min-h-4 min-w-4 rounded-lg bg-studogrey"></div>
            <span className="min-h-4 min-w-23 rounded-lg bg-studogrey">{}</span>
          </div>
        </div>
      </div>
      <div className="h-14 w-14 rounded-full bg-studogrey animate-pulse"></div>
    </div>
  );
}
