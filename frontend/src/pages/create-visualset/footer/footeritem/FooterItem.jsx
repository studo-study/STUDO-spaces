import { memo } from "react";
import Plus from "../../../../../public/assets/icons/cross.png";
import Photo from "../../../../../public/assets/icons/image.svg";

const FooterItem = memo(function FooterItem({
                                              index,
                                              isActive,
                                              previewUrl,
                                              canRemove,
                                              onSelect,
                                              onRemove
                                            }) {
  const handleRemove = (e) => {
    e.stopPropagation();
    if (canRemove) {
      onRemove();
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative min-h-11 max-h-11 min-w-11 max-w-11 cursor-grab rounded-lg active:cursor-grabbing`}
    >

      <div
        className={`absolute inset-0 z-10 ${canRemove ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}
          flex justify-center items-center backdrop-blur-sm bg-studowhite/80 rounded-lg
          opacity-0 hover:opacity-100 transition-opacity ease-in duration-300`}
      >
        <div className="rounded-full p-2 bg-studoblue">
          <img
            src={Plus}
            alt="Remove"
            className="w-3 rotate-45 cursor-pointer"
            onClick={handleRemove}
          />
        </div>
      </div>


      <div
        className={`min-w-11 min-h-11 rounded-lg bg-studowhite dark:bg-gray-600 flex justify-center items-center overflow-hidden
          ${isActive ? "ring-2 ring-white ring-offset-0" : ""}`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={Photo}
            alt="No image"
            className="w-7 dark:invert dark:brightness-0"
          />
        )}
      </div>
    </div>
  );
});

export default FooterItem;