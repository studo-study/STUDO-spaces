import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import ImageIcon from "../../../assets/icons/image.svg";

export default function AddImage({ index }) {
  const { t } = useTranslation();
  const { register, watch, setValue } = useFormContext();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const imageUrl = watch(`cardlist.0.cards.${index}.image`);

  const openModal = useCallback(() => {
    setInputValue(imageUrl || "");
    setError("");
    setShowModal(true);
  }, [imageUrl]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError("");
  }, []);

  const handleSave = useCallback(() => {
    if (!inputValue) {
      setValue(`cardlist.0.cards.${index}.image`, "");
      setShowModal(false);
      return;
    }

    if (!inputValue.startsWith("https://")) {
      setError(t("URL must start with https://"));
      return;
    }

    setValue(`cardlist.0.cards.${index}.image`, inputValue);
    setShowModal(false);
  }, [inputValue, setValue, index, t]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [handleSave, closeModal],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setValue(`cardlist.0.cards.${index}.image`, "");
    setShowModal(false);
  }, [setValue, index]);

  return (
    <>
      <input type="hidden" {...register(`cardlist.0.cards.${index}.image`)} />

      <div
        onClick={openModal}
        className="min-w-16 min-h-16 sm:min-w-20 sm:min-h-20 w-16 h-16 sm:w-20 sm:h-20
          flex justify-center items-center cursor-pointer flex-shrink-0
          bg-studowhite border-1 border-transparent border-studoborder rounded-xl sm:rounded-2xl
          shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
          dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          border-[0.5px] border-solid overflow-hidden
          dark:border-t-gray-500 dark:border-l-gray-500
          border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
          hover:opacity-80 transition-opacity"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <img
            src={ImageIcon}
            alt=""
            className="w-6 h-auto sm:w-7 dark:brightness-0 dark:invert"
          />
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] p-4 sm:p-6 md:p-8 w-full bg-white dark:bg-gray-700
            flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="dark:bg-gray-700 w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6
              shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="font-atrament text-lg sm:text-xl font-semibold text-studodarkblue dark:text-white">
                {t("add image").toUpperCase()}
              </span>
              <IoClose
                size={20}
                onClick={closeModal}
                className="cursor-pointer text-gray-500 hover:text-gray-700
                  dark:text-gray-400 dark:hover:text-white sm:w-[24px] sm:h-[24px]"
              />
            </div>

            {inputValue && inputValue.startsWith("https://") && (
              <div className="mb-3 sm:mb-4 flex justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={inputValue}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.alt = "Invalid image";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mb-3 sm:mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder={t("Paste image URL (https://...)")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base
                  bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)]
                  text-studodarkblue dark:text-white focus:outline-none outline-0"
              />
              {error && (
                <span className="text-red-500 text-xs sm:text-sm mt-1 pl-4">
                  {error}
                </span>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 justify-center">
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-2 px-3 sm:px-4 rounded-full text-sm sm:text-base
                    bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400
                    font-atrament font-semibold
                    hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  {t("Remove")}
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex flex-row items-center justify-center gap-[0.6em]
                  p-2 sm:p-3 flex-1
                  font-atrament font-normal text-base sm:text-lg md:text-xl text-[#2a3a42]
                  rounded-full bg-studoblue cursor-pointer select-none whitespace-nowrap
                  overflow-hidden text-ellipsis
                  origin-center transition ease-out duration-300
                  border-[0.5px] border-solid border-[#8181812f]
                  border-t-blue-300 border-l-blue-300
                  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                  dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                  dark:text-white font-bold"
              >
                {t("save").toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
