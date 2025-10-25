export default function ClassNav({name}) {
  return (
    <div className="p-2 pr-5 pl-5 text-center h-10 text-studodarkblue dark:text-white cursor-pointer rounded-4xl
    aria-selected:font-bold">
      {name}
    </div>
  );

}