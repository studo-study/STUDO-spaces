"use client";
import { BookOpen } from "lucide-react";
import { useCallback } from "react";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";

interface CourseToggleProps {
  courseId: string | null;
  setId: string;
}
const CourseToggle: React.FC<CourseToggleProps> = (props) => {
  const { courseId, setId } = props;

  const menuInfo = useSideMenu((state) => state.setMenuInfo);
  const isMenuOpen = useSideMenu((state) => state.menuInfo.isOpen);
  const lookUpCourse = useCallback(() => {
    menuInfo({
      isOpen: !isMenuOpen,
      origin: "course",
      course_id: courseId,
      set_id: setId,
    });
  }, [courseId, isMenuOpen, menuInfo, setId]);

  return (
    <button
      onClick={lookUpCourse}
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
