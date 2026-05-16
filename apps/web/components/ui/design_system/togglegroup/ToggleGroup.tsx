interface ToggleGroupProps {
  view: "table" | "kanban" | "calendar";
  setView: (view: "table" | "kanban" | "calendar") => void;
  options: ("table" | "kanban" | "calendar")[];
}

const ToggleGroupBase = ({ view, setView, options }: ToggleGroupProps) => {
  return (
    <div className="flex flex-row bg-studogrey/30 border border-studoborder/30 rounded-full p-1 gap-1">
      {options.map((item) => (
        <button
          key={item}
          onClick={() => setView(item)}
          className={`px-3 py-1.5 rounded-full cursor-pointer border text-sm capitalize transition-all
                        ${
                          view === item
                            ? "bg-studogrey/30 text-studodarkblue border-studoborder/30 dark:text-white shadow-sm"
                            : "text-studodarkblue/50 dark:text-white/40 border-transparent hover:text-studodarkblue dark:hover:text-white"
                        }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

ToggleGroupBase.displayName = "ToggleGroupBase";
export default ToggleGroupBase;
