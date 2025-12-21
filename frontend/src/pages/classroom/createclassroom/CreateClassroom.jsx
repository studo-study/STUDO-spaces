import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { save } from "../../../api/index.js";
import i18n from "i18next";

const validationRules = {
  name: {
    required: ("classroom name is required"),
    minLength: { value: 2, message: "name should be at least 2 characters long" },
    maxLength: { value: 64, message: "name can be maximum 64 characters long" }
  },
  type: {
    required: "type is required"
  }
};

export default function CreateClassroom({ isOpen, onClose }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  const { trigger: saveClassroom, error: saveError } = useSWRMutation("classrooms", save);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: ""
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const onSubmit = async (values) => {
    if (!isValid) return;

    await saveClassroom(
      { ...values },
      {
        throwOnError: false,
        onSuccess: () => {
          reset();
          onClose();
        }
      }
    );
  };

  return (
    <div
      ref={popupRef}
      className={`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2
        w-[95%] sm:w-[85%] md:w-[70%] lg:w-1/2 xl:w-1/3 
        max-h-[85vh] sm:max-h-3/5 min-h-fit 
        pb-6 sm:pb-8 md:pb-10
        z-[9999] flex flex-col items-center gap-3 sm:gap-4 md:gap-5
        text-xl sm:text-2xl font-semibold text-[#2a3a42]
        rounded-2xl sm:rounded-3xl border border-white/30 
        p-4 px-6 sm:p-5 sm:px-8 md:px-10
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 ease-in-out origin-top
        font-sfpro overflow-y-auto
        ${isOpen
        ? "opacity-100 scale-100 visible pointer-events-auto"
        : "opacity-0 scale-95 invisible pointer-events-none"}
      `}>
      <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-3 w-full h-fit gap-2 items-center">
        <div></div>
        <span className="font-atrament text-xl sm:text-2xl md:text-3xl dark:text-white text-center">
          {t("create classroom").toUpperCase()}
        </span>
        <div className="w-full flex items-center justify-end">
          <IoMdClose
            color="white"
            size={24}
            onClick={onClose}
            className="cursor-pointer sm:w-[30px] sm:h-[30px]"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex-1 flex flex-col py-6 sm:py-8 md:py-10 justify-center
          gap-3 bg-studowhite rounded-xl sm:rounded-2xl border-2 border-studowhite shadow-sm
          p-4 sm:p-5">
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs sm:text-sm text-studodarkblue dark:text-white">
            {t("Classroom Name")}:
          </span>
          <div className="w-full flex flex-row justify-between items-center">
            <input
              {...register("name", validationRules.name)}
              id="name"
              type="text"
              data-cy="classroom_name_input"
              placeholder={t("Name of the classroom...")}
              className="px-4 sm:px-[2vh] h-10 sm:h-12 w-full rounded-full text-sm sm:text-base border-0 py-0
                bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                dark:text-white"
            />
          </div>
          {errors.name ? (
            <p className="text-red-500 text-xs sm:text-sm mt-2 ml-4 min-h-8 sm:min-h-12 flex"
               data-cy="classroom_name_error">
              {errors.name.message}
            </p>
          ) : <div className="min-h-8 sm:min-h-12 w-full"></div>}
        </div>

        <div className="w-full flex flex-col gap-2">
          <span className="text-xs sm:text-sm text-studodarkblue w-full dark:text-white">
            {t("Classroom Type")}:
          </span>
          <div className="custom-select w-full flex flex-col min-h-10 sm:min-h-12">
            <select
              {...register("type", validationRules.type)}
              id="folder-select"
              data-cy="classroom_type_select"
              className="text-studodarkblue min-h-10 sm:min-h-12 text-sm sm:text-base
                dark:text-white px-4 sm:px-[2vh] rounded-full
                bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0">
              <option value="">{t("Select type...")}</option>
              <option value="studygroup">{t("studygroup with friends")}</option>
              <option value="school">{t("school classroom")}</option>
              <option value="official">{t("official classroom")}</option>
            </select>
          </div>
          {errors.type ? (
            <p className="text-red-500 text-xs sm:text-sm mt-2 ml-4 min-h-8 sm:min-h-12 flex"
               data-cy="classroom_type_error">
              {errors.type.message}
            </p>
          ) : <div className="min-h-8 sm:min-h-12 w-full"></div>}
        </div>

        <div className="flex justify-end gap-4 w-full">
          <button
            type="submit"
            data-cy="submit_classroom"
            className="relative px-4 sm:px-6 py-2 sm:py-3 bg-studoblue rounded-full
              text-white font-atrament text-sm sm:text-base md:text-lg
              active:scale-105 transition-transform font-semibold w-full z-[2] select-none
              border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
              cursor-pointer">
            {t("create classroom").toUpperCase()}
          </button>
        </div>
      </form>
    </div>
  );
}