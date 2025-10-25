export default function MenuPart({svg, name, isActive}) {
  return <div
    className={`flex flex-row content-center items-center gap-3 p-5 pt-2 pb-2 bg-studogrey
rounded-xl cursor-pointer text-md transition-all duration-200 ease-in-out
 text-studodarkblue font-semibold
 dark:text-white
 ${isActive ? ' border-solid border-2 border-studodarkblue dark:border-gray-300' : 'border-solid border-2 border-studogrey'}`}

  >
    <img
      className="h-4 w-4 dark:saturate-0 dark:invert dark:brightness-150 dark:contrast-200 dark:contrast-200"
      src={svg}
      alt="home icon"
    />

    <span>{name}</span>
  </div>;
}