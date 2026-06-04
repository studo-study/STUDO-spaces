import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SuggestionImage } from "@studo/types";

interface ImageItemProps {
  image: SuggestionImage;
}

const ImageItem = ({ image }: ImageItemProps) => {
  return (
    <div
      className={
        "rounded-2xl relative hover:border-studoblue overflow-hidden cursor-pointer w-full min-h-full bg-studogrey/30 border border-studoborder/30"
      }
    >
      <Image
        src={image.display_url}
        alt={image.photographer}
        fill
        className="object-cover"
      />
      <Link
        href={image.source_page_url}
        target="_blank"
        className={
          "absolute bottom-1 right-2 backdrop-blur-2xl p-0.5 h-fit w-fit truncate opacity-50 text-[6px]"
        }
      >
        Via Pexels
      </Link>
    </div>
  );
};

ImageItem.displayName = "ImageItem";
export default ImageItem;
