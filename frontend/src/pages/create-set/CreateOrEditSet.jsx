import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useCallback, useState, useEffect, useRef } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import Sortable from "sortablejs";
import Plus from "../../../public/assets/icons/plus.svg";
import Card from "./card/Card.jsx";
import Importer from "./importer/Importer.jsx";
import { getAll, getById, save } from "../../api";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" }
];

const EMPTY_CARD = { term: "", definition: "", image: "" };

const EMPTY_STUDYSET = {
  title: "",
  course: "",
  global_term_language: "",
  global_definition_language: "",
  folder_id: "",
  cardlist: [
    { cards: [{ ...EMPTY_CARD, number: 1 }, { ...EMPTY_CARD, number: 2 }, { ...EMPTY_CARD, number: 3 }] }
  ]
};

export default function CreateOrEditSet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showImporter, setShowImporter] = useState(false);
  const cardsContainerRef = useRef(null);
  const sortableRef = useRef(null);

  const { data: existingStudyset } = useSWR(id ? `studysets/${id}` : null, getById);
  const { data: foldersData = { folders: [] }, isLoading: foldersLoading } = useSWR("folders/me", getAll);
  const { trigger: saveStudyset, isMutating } = useSWRMutation("studysets", save);

  const methods = useForm({
    mode: "onBlur",
    defaultValues: existingStudyset || EMPTY_STUDYSET,
    values: existingStudyset
  });

  const { register, handleSubmit, control, formState: { errors }, getValues } = methods;
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: "cardlist.0.cards"
  });

  useEffect(() => {
    if (cardsContainerRef.current && !sortableRef.current) {
      sortableRef.current = new Sortable(cardsContainerRef.current, {
        animation: 150,
        handle: ".grab-handle",
        ghostClass: "opacity-50",
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            move(oldIndex, newIndex);
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
  }, [move]);

  const insertCard = useCallback(() => {
    append({ term: "", definition: "", image: "", number: fields.length + 1 });
  }, [append, fields.length]);

  const removeCard = useCallback((index) => {
    if (fields.length > 3) {
      remove(index);
    }
  }, [remove, fields.length]);

  const handleImport = useCallback((importedCards) => {
    const currentCards = getValues("cardlist.0.cards");
    let emptyCount = 0;

    for (let i = 0; i < currentCards.length; i++) {
      if (!currentCards[i].term && !currentCards[i].definition) {
        emptyCount++;
      } else {
        break;
      }
    }

    const newCards = [];
    for (let i = 0; i < importedCards.length; i++) {
      newCards.push({
        term: importedCards[i].term,
        definition: importedCards[i].definition,
        image: importedCards[i].url || "",
        number: i + 1
      });
    }

    for (let i = emptyCount; i < currentCards.length; i++) {
      if (currentCards[i].term || currentCards[i].definition) {
        newCards.push({
          ...currentCards[i],
          number: newCards.length + 1
        });
      }
    }

    while (newCards.length < 3) {
      newCards.push({ term: "", definition: "", image: "", number: newCards.length + 1 });
    }

    replace(newCards);
    setShowImporter(false);
  }, [getValues, replace]);

  const onSubmit = useCallback(async (data) => {
    const formattedData = {
      ...data,
      id: id || undefined,
      cardlist: [{
        cards: data.cardlist[0].cards.map((card, index) => ({
          ...card,
          number: index + 1
        }))
      }]
    };

    await saveStudyset(formattedData, {
      throwOnError: false,
      onSuccess: (response) => {
        navigate(`/studysets/${response.id || id}`);
      },
      onError: (error) => {

      }
    });
  }, [id, saveStudyset, navigate]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-screen scroll-hidden h-fit mt-10 md:mt-0 flex text-sm sm:text-base flex-col items-center justify-baseline
          pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8"
        data-cy="studyset_form">
        <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3">
          <span className="w-full text-2xl sm:text-3xl flex flex-col justify-center items-baseline
            text-studodarkblue font-atrament font-semibold dark:text-white">
            {id ? t("edit studyset").toUpperCase() : t("create new studyset").toUpperCase()}
          </span>

          <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
            <div className="flex flex-col gap-1">
              <input
                {...register("title", {
                  required: t("Title is required"),
                  maxLength: { value: 200, message: t("Title max 200 characters") }
                })}
                type="text"
                className="px-4 sm:px-[2vh] h-10 sm:h-12 rounded-full text-sm sm:text-base border-0
                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                  dark:text-white"
                autoComplete="off"
                placeholder={t("Fill in a title...")}
                data-cy="title_input"
              />
              <div className="h-5">
                {errors.title && (
                  <span className="text-red-500 text-xs sm:text-sm pl-4" data-cy="title_error">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-2 flex flex-col">
                <input
                  {...register("course", {
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
                  data-cy="course_input"
                />
                <div className="h-5">
                  {errors.course && (
                    <span className="text-red-500 text-xs sm:text-sm pl-4" data-cy="course_error">
                      {errors.course.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-1/2 gap-2 flex flex-col h-fit">
                <div className="custom-select w-full flex flex-col h-10 sm:h-12">
                  <select
                    {...register("folder_id", { required: t("Folder is required") })}
                    className="text-studodarkblue h-10 sm:h-12 text-sm sm:text-base dark:text-white"
                    data-cy="folder_select">
                    <option value="">{t("Select folder...")}</option>
                    {!foldersLoading && foldersData.folders?.map((folder) => (
                      <option value={folder.id} key={folder.id}>
                        {t(folder.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-5">
                  {errors.folder_id && (
                    <span className="text-red-500 text-xs sm:text-sm pl-4" data-cy="folder_error">
                      {errors.folder_id.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-2 flex flex-col">
                <div className="custom-select w-full flex flex-col h-10 sm:h-12">
                  <select
                    {...register("global_term_language", { required: t("Term language required") })}
                    className="text-studodarkblue h-10 sm:h-12 text-sm sm:text-base dark:text-white"
                    data-cy="term_language_select">
                    <option value="">{t("Term language...")}</option>
                    {LANGUAGES.map((lang) => (
                      <option value={lang.code} key={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div className="h-5">
                  {errors.global_term_language && (
                    <span className="text-red-500 text-xs sm:text-sm pl-4" data-cy="term_language_error">
                      {errors.global_term_language.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-1/2 gap-2 flex flex-col">
                <div className="custom-select w-full flex flex-col h-10 sm:h-12">
                  <select
                    {...register("global_definition_language", { required: t("Definition language required") })}
                    className="text-studodarkblue h-10 sm:h-12 text-sm sm:text-base dark:text-white"
                    data-cy="definition_language_select">
                    <option value="">{t("Definition language...")}</option>
                    {LANGUAGES.map((lang) => (
                      <option value={lang.code} key={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div className="h-5">
                  {errors.global_definition_language && (
                    <span className="text-red-500 text-xs sm:text-sm pl-4" data-cy="definition_language_error">
                      {errors.global_definition_language.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-end mt-4">
            <button
              type="button"
              onClick={() => setShowImporter(true)}
              className="inline-flex flex-row items-center justify-center gap-[0.6em] h-10 sm:h-12 px-6 sm:px-8
                font-atrament font-normal text-base sm:text-xl text-[#2a3a42]
                rounded-full bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:border-t-gray-500 dark:border-l-gray-500 dark:text-white"
              data-cy="import_button">
              <img src={Plus} className="h-4 sm:h-5 dark:brightness-0 dark:invert" alt="" />
              {t("import").toUpperCase()}
            </button>

            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex flex-row items-center justify-center gap-[0.6em] h-10 sm:h-12 px-6 sm:px-8
                font-atrament font-normal text-base sm:text-xl text-[#2a3a42]
                rounded-full bg-studoblue cursor-pointer select-none whitespace-nowrap
                border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white disabled:opacity-50"
              data-cy="submit_studyset_top">
              {isMutating ? t("saving...").toUpperCase() : (id ? t("save set").toUpperCase() : t("create set").toUpperCase())}
            </button>
          </div>

          <div ref={cardsContainerRef}
               className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8 md:pt-10"
               data-cy="cards_container">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                index={index}
                disabled={fields.length <= 3}
                onRemove={() => removeCard(index)}
              />
            ))}
          </div>

          <div className="flex w-full mb-3 sm:mb-4 md:mb-5">
            <button
              type="button"
              onClick={insertCard}
              className="inline-flex flex-row items-center justify-center gap-[0.6em] p-2 sm:p-3
                font-atrament font-normal text-base sm:text-xl text-[#2a3a42] w-full
                rounded-full bg-emerald-400
                border-[0.5px] border-solid border-[#8181812f] border-t-emerald-300 border-l-emerald-300
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-emerald-400 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white font-bold"
              data-cy="add_card_button">
              {t("add card").toUpperCase()}
            </button>
          </div>

          <div className="flex w-full mb-6 sm:mb-8 md:mb-10 flex-row justify-end">
            <button
              type="submit"
              className="inline-flex flex-row items-center justify-center gap-[0.6em] p-2 sm:p-3
                font-atrament text-base sm:text-xl text-[#2a3a42] w-full sm:w-1/2 md:w-1/3 lg:w-1/4
                rounded-full bg-studoblue cursor-pointer select-none whitespace-nowrap
                border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white"
              data-cy="submit_studyset_bottom">
              {isMutating ? t("saving...").toUpperCase() : (id ? t("save set").toUpperCase() : t("create set").toUpperCase())}
            </button>
          </div>
        </div>

        {showImporter && (
          <Importer
            onClose={() => setShowImporter(false)}
            onImport={handleImport}
          />
        )}
      </form>
    </FormProvider>
  );
}