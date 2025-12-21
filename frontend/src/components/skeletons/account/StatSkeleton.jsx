export default function StatSkeleton() {
  return (<div className="flex bg-studowhite border-transparent border-studoborder
     shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-7 backdrop-blur-xs
     flex-row w-1/3 min-h-13 max-h-13 rounded-4xl justify-center items-center gap-3
     dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
    <div className="min-w-10 min-h-5 bg-studogrey rounded-lg"></div>
    <div className="min-w-50 min-h-5 bg-studogrey rounded-lg"></div>

  </div>);
}