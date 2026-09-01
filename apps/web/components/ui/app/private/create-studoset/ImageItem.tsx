import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SuggestionImage } from "@studo/types";

interface ImageItemProps {
  image: SuggestionImage;
  selectImage: (value: SuggestionImage | null) => void;
  selected: SuggestionImage | null;
}

const ImageItem = ({ image, selectImage, selected }: ImageItemProps) => {
  const isSelected = selected?.id === image.id;
  const onSelect = () => {
    selectImage(isSelected ? null : image);
  };
  return (
    <div
      onClick={() => onSelect()}
      className={`rounded-2xl relative border-2 hover:border-studoblue ${isSelected ? "border-studoblue" : "border-neutral-200/30"} overflow-hidden cursor-pointer w-full min-h-full bg-studogrey/30 `}
    >
      <Image
        src={image.displayUrl}
        alt={image.photographer}
        fill
        className="object-cover"
      />
      <Link
        href={image.sourcePageUrl}
        target="_blank"
        className={
          "absolute bottom-1 right-2 backdrop-blur-2xl p-0.5 h-fit w-fit truncate opacity-50 text-[6px]"
        }
      >
        Via {image.source === "wikimedia" ? "Wikimedia" : "Pexels"}
      </Link>
    </div>
  );
};

ImageItem.displayName = "ImageItem";
export default ImageItem;
