import { RiImageCircleAiFill } from "react-icons/ri";
import { SuggestionImage } from "@studo/types";
import Image from "next/image";

interface ImageTriggerProps {
  imageTabOpen: boolean;
  setImageTabOpen: (open: boolean) => void;
  image: SuggestionImage | null;
}

const ImageTrigger = ({
  imageTabOpen,
  setImageTabOpen,
  image,
}: ImageTriggerProps) => {
  return (
    <button
      className={
        "h-10.5 min-w-10.5 relative rounded-4xl overflow-hidden border text-xl items-center justify-center flex cursor-pointer select-none border-studoborder/30 bg-studogrey/30"
      }
      type={"button"}
      onClick={() => setImageTabOpen(!imageTabOpen)}
    >
      {image && (
        <Image
          src={image.display_url}
          alt={image.id}
          width={80}
          height={80}
          className={"absolute z-40 object-cover min-h-10.5 min-w-10.5"}
        />
      )}
      <RiImageCircleAiFill />
    </button>
  );
};

ImageTrigger.displayName = "ImageTrigger";
export default ImageTrigger;
