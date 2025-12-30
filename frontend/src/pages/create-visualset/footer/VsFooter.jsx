import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import Sortable from "sortablejs";
import Plus from "../../../assets/icons/cross.png";
import FooterItem from "./footeritem/FooterItem.jsx";

export default function VsFooter({
                                   images,
                                   activeIndex,
                                   onSelectImage,
                                   onAddImage,
                                   onRemoveImage,
                                   onReorderImages,
                                   isMutating
                                 }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const containerRef = useRef(null);
  const sortableRef = useRef(null);

  const watchedImages = watch("images");

  useEffect(() => {
    if (containerRef.current && !sortableRef.current) {
      sortableRef.current = new Sortable(containerRef.current, {
        animation: 150,
        ghostClass: "opacity-50",
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            onReorderImages(oldIndex, newIndex);
          }
        }
      });
    }

    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [onReorderImages]);

  return (
    <div className="w-full h-auto min-h-[68px] sm:min-h-[76px]
      rounded-2xl sm:rounded-br-4xl sm:rounded-tr-4xl bg-studogrey
      flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center
      p-2 sm:p-3 justify-between overflow-visible scroll-hidden">

      {/* Add image button */}
      <div
        onClick={onAddImage}
        className="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 bg-studogrey flex justify-center items-center
          rounded-lg cursor-pointer
          hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
          self-start sm:self-auto">
        <img src={Plus} className="h-4 sm:h-5 dark:invert dark:brightness-0" alt="Add" />
      </div>

      {/* Sortable images list */}
      <div
        ref={containerRef}
        className="h-10 sm:h-12 w-full px-0.5 sm:px-0.75 bg-studogrey scroll-hidden
          items-center rounded-lg gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden
          flex flex-row">
        {images.map((field, index) => (
          <FooterItem
            key={field.id}
            index={index}
            isActive={activeIndex === index}
            previewUrl={watchedImages?.[index]?.previewUrl}
            canRemove={images.length > 1}
            onSelect={() => onSelectImage(index)}
            onRemove={() => onRemoveImage(index)}
          />
        ))}
      </div>

      {/* Create button */}
      <button
        type="submit"
        disabled={isMutating}
        className="h-10 sm:h-11 min-w-fit px-4 sm:px-5
          font-atrament cursor-pointer flex justify-center items-center
          rounded-full font-semibold text-xs sm:text-sm
          active:scale-105 transition-transform z-[2]
          border-[0.5px] border-solid border-[#8181812f]
          shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffffaa]
          dark:shadow-[3px_3px_6px_#3A3939,-3px_-3px_6px_#3A3939]
          bg-studoblue text-white border-t-blue-300 border-l-blue-300
          disabled:opacity-50 flex-shrink-0">
        {isMutating ? t("saving...").toUpperCase() : t("create visualset").toUpperCase()}
      </button>
    </div>
  );
}