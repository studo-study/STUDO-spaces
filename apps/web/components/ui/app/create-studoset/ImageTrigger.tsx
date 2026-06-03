import { RiImageCircleAiFill } from "react-icons/ri";

interface ImageTriggerProps {
  setImageTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageTrigger = ({ setImageTabOpen }: ImageTriggerProps) => {
  return (
    <button
      className={
        "h-10.5 min-w-10.5 rounded-4xl border text-xl items-center justify-center flex cursor-pointer select-none border-studoborder/30 bg-studogrey/30"
      }
      type={"button"}
      onClick={() => setImageTabOpen((prev) => !prev)}
    >
      <RiImageCircleAiFill />
    </button>
  );
};

ImageTrigger.displayName = "ImageTrigger";
export default ImageTrigger;
