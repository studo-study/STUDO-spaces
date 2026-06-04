import { Link } from "@/i18n/routing";

interface ImageSuggestionTabProps {
  term: string;
}
const ImageSuggestionTab = ({ term }: ImageSuggestionTabProps) => {
  return (
    <div
      className={"w-full min-h-full h-full grid grid-rows-1 grid-cols-4 gap-5"}
    >
      <div
        className={
          "rounded-2xl relative hover:border-studoblue overflow-hidden object-cover cursor-pointer w-full min-h-full bg-studogrey/30 border border-studoborder/30"
        }
      >
        <Link
          href={"https://pixabay.com"}
          className={
            "absolute bottom-1 right-2 backdrop-blur-2xl p-0.5 h-fit w-fit truncate opacity-50 text-[6px]"
          }
        >
          Via Pixabay
        </Link>
      </div>
    </div>
  );
};

ImageSuggestionTab.displayName = "ImageSuggestionTab";
export default ImageSuggestionTab;
