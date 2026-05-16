import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export default function ImageInfo({ activeImageIndex }) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const imageErrors = errors?.images?.[activeImageIndex];

  return (
    <div className="w-full h-full p-5">
      <label className="block text-sm font-semibold text-studodarkblue dark:text-white mb-2">
        {t("Image title")}
      </label>
      <input
        {...register(`images.${activeImageIndex}.title`, {
          maxLength: { value: 100, message: t("Title max 100 characters") },
        })}
        type="text"
        className="px-[2vh] h-12 rounded-[50px] text-base border-0
          bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
          border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
          dark:text-white"
        autoComplete="off"
        placeholder={t("Fill in a title for this image...")}
      />
      {imageErrors?.title ? (
        <span className="text-red-500 text-sm h-8 pl-4">
          {imageErrors.title.message}
        </span>
      ) : (
        <div className={"h-8"}></div>
      )}
    </div>
  );
}
