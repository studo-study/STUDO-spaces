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
          "rounded-2xl w-full min-h-full bg-studogrey/30 border border-studoborder/30 animate-pulse"
        }
      />
      <div
        className={
          "rounded-2xl w-full min-h-full bg-studogrey/30 border border-studoborder/30 animate-pulse"
        }
      />
      <div
        className={
          "rounded-2xl w-full min-h-full bg-studogrey/30 border border-studoborder/30 animate-pulse"
        }
      />
      <div
        className={
          "rounded-2xl w-full min-h-full bg-studogrey/30 border border-studoborder/30 animate-pulse"
        }
      />
    </div>
  );
};

ImageSuggestionTab.displayName = "ImageSuggestionTab";
export default ImageSuggestionTab;
