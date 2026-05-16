import { useOutletContext } from "react-router-dom";
import Item from "./Item.jsx";

export default function Sets() {
  const { studysets } = useOutletContext();

  if (!studysets || studysets.length === 0) {
    return (
      <div className="w-full h-fit flex items-center justify-center p-6 sm:p-8 md:p-10">
        <p className="text-studodarkblue dark:text-white text-sm sm:text-base">
          Geen sets gevonden
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4">
      {studysets.map((set) => (
        <Item key={set.id} set={set} />
      ))}
    </div>
  );
}
