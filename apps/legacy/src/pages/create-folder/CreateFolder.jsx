import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { save } from "../../api/index.js";
import { useNavigate } from "react-router-dom";

const validationRules = {
  name: {
    required: "Folder name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
  },
};

export default function CreateFolder() {
  const { t } = useTranslation();
  let navigate = useNavigate();

  const { trigger: saveFolder, error: saveError } = useSWRMutation(
    "folders",
    save,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values) => {
    if (!isValid) return;

    await saveFolder(
      {
        name: values.name,
      },
      {
        throwOnError: false,
        onSuccess: () => {
          reset();
          navigate(-1);
        },
      },
    );
  };

  return (
    <div className="w-screen h-screen flex items-baseline pt-20 z-[0]  md:mt-0 mt-50 sm:pt-40 md:pt-75 justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 sm:gap-5 items-center justify-baseline
          px-6 sm:px-8 py-6 sm:py-8 md:py-10
          bg-studowhite dark:bg-gray-700
          rounded-2xl sm:rounded-4xl
          w-full sm:w-[450px] md:w-100
          min-h-fit h-fit
          shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
          dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
      >
        <span className="w-full text-lg sm:text-xl md:text-2xl px-2 sm:px-5 font-bold text-studodarkblue dark:text-white">
          {t("Create a folder")}:
        </span>

        <div className="flex flex-col w-full gap-2 items-center justify-between">
          <input
            {...register("name", validationRules.name)}
            type="text"
            className="px-4 sm:px-[2vh] min-h-10 sm:min-h-12 rounded-full
              text-sm sm:text-base border-0
              bg-[rgba(255,255,255,0.175)] w-full
              shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
              border-b-[1.3px] border-b-[rgba(255,255,255,0.352)]
              outline-0 text-studodarkblue
              dark:text-white"
            autoComplete="off"
            placeholder={t("Fill in a name...")}
          />
          {errors.name ? (
            <p className="text-red-500 text-xs sm:text-sm w-full px-2 sm:px-5 h-4 sm:h-5">
              {t(errors.name.message)}
            </p>
          ) : (
            <div className="h-4 sm:h-5"></div>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex flex-row items-center gap-[0.6em]
            px-4 sm:px-6 py-2 sm:py-3
            font-atrament font-normal text-base sm:text-lg md:text-xl
            text-[#2a3a42] justify-center w-full
            rounded-full bg-studoblue cursor-pointer select-none
            whitespace-nowrap overflow-hidden text-ellipsis
            origin-center transition ease-out duration-300
            border-[0.5px] border-solid border-[#8181812f]
            border-t-blue-300 border-l-blue-300
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            dark:text-white font-bold active:scale-95"
        >
          {t("create folder").toUpperCase()}
        </button>
      </form>

      {saveError && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          {t("Error creating folder")}: {saveError.message}
        </p>
      )}
    </div>
  );
}
