import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Delete from "../../../assets/icons/delete.svg";
import Grab from "../../../assets/icons/grab.svg";
import AddImage from "../addImage/AddImage.jsx";

const Card = memo(function Card({ index, disabled, onRemove }) {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext();

  const cardErrors = errors?.cardlist?.[0]?.cards?.[index];

  return (
    <div className="flex justify-around items-baseline flex-col
      bg-studowhite h-fit w-full gap-3 sm:gap-4 md:gap-5 border-1 border-transparent border-studoborder
      rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      mb-6 sm:mb-8 md:mb-10
      border-[0.5px] border-solid overflow-hidden
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">

      <div className="w-full h-10 sm:h-13 bg-studowhite flex flex-row justify-between
        items-center p-2 px-4 sm:p-3 sm:px-6 md:px-8 border-0 border-solid border-b-2
        dark:border-gray-500 border-gray-300">
        <span className="text-studodarkblue dark:text-white text-sm sm:text-base">{index + 1}</span>
        <div className="flex flex-row gap-2 sm:gap-3">
          <img
            src={Delete}
            alt="delete"
            onClick={onRemove}
            className={`${disabled ? "pointer-events-none opacity-50 cursor-default" : "cursor-pointer"}
              h-4 sm:h-5 dark:invert dark:brightness-0`}
          />
          <img
            src={Grab}
            alt="grab"
            className="grab-handle h-4 sm:h-5 cursor-grab dark:invert dark:brightness-0"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-3">
        <div className="flex flex-col pb-4 sm:pb-6 md:pb-8 p-3 px-4 sm:px-6 md:px-8 w-full gap-3 justify-between">
          <div className="flex flex-col gap-1">
            <input
              {...register(`cardlist.0.cards.${index}.term`, {
                required: t("Term is required"),
                maxLength: { value: 128, message: t("Term max 128 characters") }
              })}
              type="text"
              className="px-3 sm:px-[2vh] h-10 sm:h-12 rounded-full text-sm sm:text-base border-0
                bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                dark:text-white"
              autoComplete="off"
              placeholder={t("Term")}
            />
            {cardErrors?.term && (
              <span className="text-red-500 text-xs sm:text-sm pl-4">{cardErrors.term.message}</span>
            )}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between w-full pb-4 sm:pb-6 md:pb-8 p-3 gap-3 sm:gap-6 md:gap-9 px-4 sm:px-6 md:px-8">
          <div className="w-full flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-1">
              <input
                {...register(`cardlist.0.cards.${index}.definition`, {
                  required: t("Definition is required"),
                  maxLength: { value: 128, message: t("Definition max 128 characters") }
                })}
                type="text"
                className="px-3 sm:px-[2vh] h-10 sm:h-12 rounded-full text-sm sm:text-base border-0
                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                  dark:text-white"
                autoComplete="off"
                placeholder={t("Definition")}
              />
              {cardErrors?.definition && (
                <span className="text-red-500 text-xs sm:text-sm pl-4">{cardErrors.definition.message}</span>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <AddImage index={index} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;