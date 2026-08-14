import { BookOpen } from "lucide-react";

interface CourseToggleProps {
  isInCourse: boolean;
}
const CourseToggle: React.FC<CourseToggleProps> = (props) => {
  return (
    <button
      type={"button"}
      className="inline-flex  cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-studodarkblue justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
    >
      <BookOpen size={15} />
    </button>
  );
};

CourseToggle.displayName = "CourseToggle";
export default CourseToggle;
