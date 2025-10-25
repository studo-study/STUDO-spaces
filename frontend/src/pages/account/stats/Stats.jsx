export default function Stats({title, waarde, svg}) {
  return (
    <div className="flex bg-studowhite border-transparent border-studoborder
     shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-7 backdrop-blur-xs
     flex-row w-1/3 h-10 rounded-4xl justify-center items-center gap-3
     dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
      <img src={svg} className="h-5 dark:brightness-0 dark:invert" alt="svg"/>
      <span className="text-lg font-bold text-studodarkblue dark:text-white">{title}:</span>
      <span className="text-lg  text-studodarkblue dark:text-white">{waarde}</span>
    </div>);
}