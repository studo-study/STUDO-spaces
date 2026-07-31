import { FaChevronRight } from "react-icons/fa";
import { Link } from "@/i18n/routing";

interface BreadCrumbsProps {
  board_title: string;
  board_id: string;
  course_title?: string;
  course_id: string | undefined;
}
const BreadCrumbs = (props: BreadCrumbsProps) => {
  const { board_title, board_id, course_title, course_id } = props;
  return (
    <div className="w-full gap-1 dark:text-blue-400 text-emerald-400 absolute top-0 left-2 flex flex-row items-center">
      <Link
        href={"/flow/" + board_id + "/overview"}
        className={
          "text-xs px-3 py-1 border hover:underline border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"
        }
      >
        {" "}
        {board_title}
      </Link>
      <FaChevronRight size={12} />
      <Link
        href={"/flow/" + board_id + "/" + course_id}
        className={
          "text-xs px-3 py-1 border hover:underline border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"
        }
      >
        {" "}
        {course_title}
      </Link>
    </div>
  );
};

BreadCrumbs.displayName = "BreadCrumbs";
export default BreadCrumbs;
