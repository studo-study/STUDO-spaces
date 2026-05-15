export default function Stats({ title, waarde, svg }) {
  return (
    <div
      className="flex bg-studowhite border-transparent border-studoborder
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-4 sm:p-5 md:p-7 backdrop-blur-xs
      flex-row w-full sm:w-1/3 min-h-fit sm:min-h-13 sm:max-h-13
      rounded-2xl sm:rounded-4xl
      justify-center items-center gap-2 sm:gap-3
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
    >
      <img
        src={svg}
        className="h-4 sm:h-5 flex-shrink-0 dark:brightness-0 dark:invert"
        alt="svg"
      />
      <span className="text-sm sm:text-base md:text-lg font-bold text-studodarkblue dark:text-white truncate">
        {title}:
      </span>
      <span className="text-sm sm:text-base md:text-lg text-studodarkblue dark:text-white">
        {waarde}
      </span>
    </div>
  );
}
