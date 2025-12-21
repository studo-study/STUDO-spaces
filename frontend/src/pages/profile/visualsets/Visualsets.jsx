import { useOutletContext } from "react-router-dom";
import Item from "./Item.jsx";

export default function Visualsets() {
  const { visualsets } = useOutletContext();

  if (!visualsets || visualsets.length === 0) {
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
      {visualsets.map((set) => (
        <Item key={set.id} set={set} />
      ))}
    </div>
  );
}