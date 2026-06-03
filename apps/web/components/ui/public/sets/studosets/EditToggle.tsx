import { Link } from "@/i18n/routing";
import { MdEdit } from "react-icons/md";

interface EditToggleProps {
  id: string;
}
const EditToggle = ({ id }: EditToggleProps) => {
  return (
    <Link
      href={"/studoset/" + id + "/edit"}
      className="inline-flex cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-[#2a3a42] justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
    >
      <MdEdit />
    </Link>
  );
};

EditToggle.displayName = "EditToggle";
export default EditToggle;
