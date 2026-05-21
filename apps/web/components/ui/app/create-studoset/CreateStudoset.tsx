"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import SetImporter from "@/components/ui/app/create-studoset/SetImporter";
import CardItem from "@/components/ui/app/create-studoset/CardItem";
import Sortable from "sortablejs";
import ImportButton from "@/components/ui/app/create-studoset/importButton";
import { useRouter } from "@/i18n/routing";
import { CardData, Folder } from "@/types/types";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToast } from "@/components/providers/ToastProvider";
import InputField from "@/components/ui/design_system/input/InputField";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
];

const firstCard = (): CardData => ({
  id: crypto.randomUUID(),
  index: 0,
  term: "",
  definition: "",
  image: "",
  isDouble: false,
});

export default function CreateStudosetForm() {
  const t = useTranslations("createstudoset");
  const [showImporter, setShowImporter] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [folders, setFolders] = useState<{ folders: Folder[] }>({
    folders: [],
  });
  const [cardArray, setCardArray] = useState<CardData[]>([firstCard()]);

  const titleRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLSelectElement>(null);
  const termLangRef = useRef<HTMLSelectElement>(null);
  const defLangRef = useRef<HTMLSelectElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const validate = (): boolean => {
    const title = titleRef.current?.value?.trim();
    const course = courseRef.current?.value?.trim();
    const folderId = folderRef.current?.value;
    const termLang = termLangRef.current?.value;
    const defLang = defLangRef.current?.value;

    if (!title) {
      toast.error(t("title_error"));
      return false;
    }
    if (!course) {
      toast.error(t("course_error"));
      return false;
    }
    if (!folderId) {
      toast.error(t("folder_error"));
      return false;
    }
    if (!termLang) {
      toast.error(t("term_lang_error"));
      return false;
    }
    if (!defLang) {
      toast.error(t("def_lang_error"));
      return false;
    }

    if (cardArray.length === 0) {
      toast.error(t("card_error"));
      return false;
    }
    const hasEmptyCard = cardArray.some(
      (c) => !c.term.trim() || !c.definition.trim(),
    );
    if (hasEmptyCard) {
      toast.error(t("card_error"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isMutating) return;
    if (!validate()) return;

    const body = {
      title: titleRef.current!.value.trim(),
      course: courseRef.current!.value.trim(),
      global_term_language: termLangRef.current!.value,
      global_definition_language: defLangRef.current!.value,
      folder_id: folderRef.current!.value,
      cardlist: cardArray.map((card) => ({
        term: card.term.trim(),
        definition: card.definition.trim(),
        number: card.index,
        image: card.image || null,
      })),
    };

    setIsMutating(true);
    try {
      const res = await fetch("/api/studysets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error(t("submit_error"));
        return;
      }

      const data = await res.json();
      router.push(`/studoset/${data.id}`);
    } catch {
      toast.error(t("submit_error"));
    } finally {
      setIsMutating(false);
    }
  };

  const addCard = () => {
    setCardArray((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        index: prev.length,
        term: "",
        definition: "",
        image: "",
        isDouble: false,
      },
    ]);
  };

  const insertCard = (index: number) => {
    setCardArray((prev) => {
      const updated = [
        ...prev.slice(0, index),
        {
          id: crypto.randomUUID(),
          index,
          term: "",
          definition: "",
          image: "",
          isDouble: false,
        },
        ...prev.slice(index),
      ];
      return updated.map((card, i) => ({ ...card, index: i }));
    });
  };

  const deleteCard = (id: string) => {
    setCardArray((prev) => {
      if (prev.length === 1) return prev;
      return prev
        .filter((card) => card.id !== id)
        .map((card, i) => ({ ...card, index: i }));
    });
  };

  const deleteLatestCard = () => {
    setCardArray((prev) => {
      if (prev.length === 1) return prev;
      return prev.slice(0, -1).map((card, i) => ({ ...card, index: i }));
    });
  };

  const updateCard = (id: string, field: string, value: string) => {
    setCardArray((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    );
  };

  const duplicates = cardArray
    .filter((card, i) =>
      cardArray.some(
        (other, j) =>
          i !== j &&
          card.term === other.term &&
          card.definition === other.definition &&
          card.term !== "",
      ),
    )
    .map((card) => card.id);

  useEffect(() => {
    if (!cardsContainerRef.current) return;
    const sortable = new Sortable(cardsContainerRef.current, {
      animation: 300,
      handle: ".handle",
      onEnd: (event) => {
        if (event.oldIndex == null || event.newIndex == null) return;
        setCardArray((prev) => {
          const newArr = [...prev];
          const [moved] = newArr.splice(event.oldIndex!, 1);
          newArr.splice(event.newIndex!, 0, moved);
          return newArr.map((card, index) => ({ ...card, index }));
        });
      },
    });
    return () => sortable.destroy();
  }, []);

  useEffect(() => {
    fetch("/api/folders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setFolders(data);
      })
      .catch(() => {});
  }, []);

  useKeyboardShortcut("i", () => setShowImporter((p) => !p), {
    ctrl: true,
    always: true,
  });
  useKeyboardShortcut("a", addCard, { ctrl: true, always: true });
  useKeyboardShortcut("s", () => handleSubmit(), { ctrl: true, always: true });
  useKeyboardShortcut("backspace", deleteLatestCard, {
    ctrl: true,
    always: true,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full scroll-hidden text-studodarkblue dark:text-white h-fit mt-10 md:mt-0 flex text-sm sm:text-base flex-col items-center justify-baseline pt-20 px-10"
        data-cy="studyset_form"
      >
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <span className="w-full text-2xl sm:text-3xl flex flex-col justify-center items-baseline text-studodarkblue font-bold dark:text-white">
            {t("title")}
          </span>

          <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
            <div className="flex flex-col gap-1">
              <InputField
                ref={titleRef}
                variant={"cardInput"}
                placeholder={t("title_placeholder")}
                data-cy="title_input"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                <InputField
                  ref={courseRef}
                  variant={"cardInput"}
                  placeholder={t("course_placeholder")}
                  data-cy="course_input"
                />
              </div>

              <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                <select
                  ref={folderRef}
                  className="h-10 text-sm px-5 gap-5 text-studodarkblue dark:text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"
                  data-cy="folder_select"
                >
                  <option value="">{t("folder_placeholder")}</option>
                  {folders?.folders?.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                <select
                  ref={termLangRef}
                  className="h-10 text-sm px-5 gap-5 text-studodarkblue dark:text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"
                  data-cy="term_language_select"
                >
                  <option value="">{t("term_language")}</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.code} key={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                <select
                  ref={defLangRef}
                  className="h-10 text-sm px-5 gap-5 text-studodarkblue dark:text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"
                  data-cy="definition_language_select"
                >
                  <option value="">{t("def_language")}</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.code} key={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-end mt-4">
            <ImportButton setShowImporter={setShowImporter} />
            <BaseButton
              type="submit"
              disabled={isMutating}
              variant={"submit"}
              textSize={"sm"}
              data-cy="submit_studyset_top"
              className={"max-h-10"}
              label={isMutating ? t("saving") : t("create")}
            />
          </div>

          <div
            ref={cardsContainerRef}
            className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8 md:pt-10"
            data-cy="cards_container"
          >
            {cardArray.map((card, index) => (
              <CardItem
                key={card.id}
                id={card.id}
                index={card.index}
                term={card.term}
                definition={card.definition}
                isDouble={duplicates.includes(card.id)}
                deleteCard={deleteCard}
                updateCard={updateCard}
                length={cardArray.length}
                insertCard={() => insertCard(index + 1)}
              />
            ))}
          </div>

          <div className="flex w-full mb-3 sm:mb-4 md:mb-5 group relative">
            <BaseButton
              onClick={addCard}
              type="button"
              className="w-full"
              variant={"approve"}
              data-cy="add_card_button"
            >
              {t("add_card")}
            </BaseButton>
          </div>

          <div className="flex w-full mb-6 sm:mb-8 md:mb-10 flex-row justify-end">
            <BaseButton
              type="submit"
              disabled={isMutating}
              variant={"submit"}
              textSize={"sm"}
              data-cy="submit_studyset_top"
              className={"min-w-1/4 max-h-10"}
              label={isMutating ? t("saving") : t("create")}
            />
          </div>
        </div>

        {showImporter && (
          <SetImporter
            cardArray={cardArray}
            setCardArray={setCardArray}
            onClose={() => setShowImporter(false)}
          />
        )}
      </form>
    </>
  );
}
