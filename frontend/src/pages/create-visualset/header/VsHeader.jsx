import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export default function VsHeader({ folders, foldersLoading, errors }) {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <div className="w-full h-fit flex flex-col gap-2 sm:gap-3 scroll-hidden">
      <span className="w-full text-2xl sm:text-3xl flex flex-col justify-baseline items-baseline
        text-studodarkblue font-atrament font-semibold dark:text-white">
        {t("create new visualset").toUpperCase()}
      </span>

      <div className="w-full gap-3 sm:gap-4 flex-col flex">
        <div className="flex flex-col gap-1">
          <input
            {...register("title", {
              required: t("Title is required"),
              maxLength: { value: 100, message: t("Title max 100 characters") }
            })}
            type="text"
            className="px-4 sm:px-[2vh] h-10 sm:h-12 rounded-full text-sm sm:text-base border-0
              bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
              border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
              dark:text-white"
            autoComplete="off"
            placeholder={t("Fill in a title...")}
          />
          {errors?.title ? (
            <span className="text-red-500 text-xs sm:text-sm min-h-6 pl-4">{errors.title.message}</span>
          ) : <div className="min-h-6 w-full"></div>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
          <div className="w-full sm:w-1/2 gap-2 flex flex-col">
            <input
              {...register("subject", {
                required: t("Course is required"),
                maxLength: { value: 100, message: t("Course max 100 characters") }
              })}
              type="text"
              autoComplete="off"
              placeholder={t("Fill in a course...")}
              className="px-4 sm:px-[2vh] h-10 sm:h-12 w-full rounded-full text-sm sm:text-base border-0
                bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                dark:text-white"
            />
            {errors?.subject && (
              <span className="text-red-500 text-xs sm:text-sm min-h-6 pl-4">{errors.subject.message}</span>
            )}
          </div>

          <div className="w-full sm:w-1/2 gap-2 flex flex-col">
            <div className="custom-select">
              <select
                {...register("folder_id", { required: t("Folder is required") })}
                className="px-4 sm:px-[2vh] h-10 sm:h-12 w-full rounded-full text-sm sm:text-base border-0
                  bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0
                  text-studodarkblue dark:text-white cursor-pointer">
                <option value="">{t("Select folder...")}</option>
                {!foldersLoading && folders?.map((folder) => (
                  <option value={folder.id} key={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            {errors?.folder_id ? (
              <span className="text-red-500 text-xs sm:text-sm min-h-6 pl-4">{errors.folder_id.message}</span>
            ) : <div className="min-h-6 w-full"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}