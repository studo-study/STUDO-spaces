import { LastStudied } from "@studo/types";
import { Link } from "@/i18n/routing";
import SmallProgress from "@/components/ui/design_system/progress/SmallProgress";
import { GalleryVerticalEnd, Images } from "lucide-react";

interface SetItemProps {
  item: LastStudied;
}
const HomePageSetItem = (props: SetItemProps) => {
  const { item } = props;
  return (
    <Link
      href={
        item.type === "studyset"
          ? "/studoset/" + item.setId
          : "/visualset/" + item.setId
      }
      className={
        "w-full cursor-pointer h-10 rounded-xl border bg-studogrey/30 border-studoborder/30 hover:border-studoborder transition-all duration-300 flex justify-between items-center px-5 gap-2"
      }
    >
      <div className={"flex flex-row items-center gap-2"}>
        {item.type === "studyset" ? (
          <GalleryVerticalEnd size={15} />
        ) : (
          <Images size={15} />
        )}

        <span className={"font-bold dark:text-white text-studodarkblue"}>
          {item.title}
        </span>
      </div>
      <div className={"flex flex-row gap-2 w-1/3"}>
        <SmallProgress progress={item.progress * 2} length={item.length || 1} />
      </div>
    </Link>
  );
};

HomePageSetItem.displayName = "HomePageSetItem";
export default HomePageSetItem;
