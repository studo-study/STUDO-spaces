import { memo } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";

const ItemOverview = memo(function ItemOverview({ pins, onRemovePin }) {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-3 sm:p-4 md:p-5 border-b border-gray-300 dark:border-gray-600">
        <span className="font-semibold text-xs sm:text-sm text-studodarkblue dark:text-white">
          {t("Pins")} ({pins.length})
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto p-2 sm:p-3">
        {pins.length === 0 ? (
          <li className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-xs sm:text-sm px-2">
            {t("Click on the image to add pins")}
          </li>
        ) : (
          pins.map((pin, index) => (
            <li
              key={`${pin.x}-${pin.y}-${index}`}
              className="flex items-center justify-between p-2 sm:p-3 mb-2
                bg-studowhite dark:bg-gray-600 rounded-xl
                hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors
                cursor-pointer group"
              onClick={() => onRemovePin(index)}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0
                  bg-studoblue text-white text-[10px] sm:text-xs font-bold rounded-full">
                  {index + 1}
                </span>
                <span className="text-studodarkblue dark:text-white text-xs sm:text-sm truncate">
                  {pin.definition}
                </span>
              </div>
              <IoClose
                className="text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                size={16}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
});

export default ItemOverview;