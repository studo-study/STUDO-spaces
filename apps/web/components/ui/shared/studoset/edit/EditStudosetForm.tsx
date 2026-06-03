"use client";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateStudyset } from "@/hooks/app/sets/useUpdateStudoset";
import CardItem from "@/components/ui/app/create-studoset/CardItem";
import Sortable from "sortablejs";
import { useRouter } from "@/i18n/routing";
import { CardData } from "@/types/types";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import { useToast } from "@/components/providers/app/ToastProvider";
import InputField from "@/components/ui/design_system/input/InputField";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useFolders } from "@/hooks/app/folders/useFolders";
import { useInView } from "react-intersection-observer";
import JumpToBottom from "@/components/ui/app/create-studoset/JumpToBottom";
import { useStudoset } from "@/hooks/app/sets/useStudoset";

interface EditsetProps {
  id: string;
}
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
  contentType: "text" as const,
  codeLanguage: "typescript",
});

export default function EditStudosetForm({ id }: EditsetProps) {
  const t = useTranslations("editstudoset");
  const router = useRouter();
  const mutation = useUpdateStudyset(id);
  const set = useStudoset(id).data;
  const toast = useToast();
  const folders = useFolders().data?.folders ?? [];
  const { ref, inView } = useInView();
  const topRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const jumpToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const jumpToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [cardArray, setCardArray] = useState<CardData[]>([firstCard()]);

  const titleRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLSelectElement>(null);
  const termLangRef = useRef<HTMLSelectElement>(null);
  const defLangRef = useRef<HTMLSelectElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cardRefsMap = useRef<
    Map<
      string,
      {
        term: React.RefObject<HTMLInputElement | null>;
        def: React.RefObject<HTMLInputElement | null>;
      }
    >
  >(new Map());
  const focusAfterAdd = useRef(false);
  const seeded = useRef(false);

  const getCardRefs = (id: string) => {
    if (!cardRefsMap.current.has(id)) {
      cardRefsMap.current.set(id, {
        term: React.createRef<HTMLInputElement>(),
        def: React.createRef<HTMLInputElement>(),
      });
    }
    return cardRefsMap.current.get(id)!;
  };

  useEffect(() => {
    if (!set || seeded.current) return;
    if (!set.cards?.length) return;
    seeded.current = true;
    setCardArray(
      set.cards.map((card, i) => ({
        id: card.id,
        index: i,
        term: card.term,
        definition: card.definition,
        image: "",
        isDouble: false,
        contentType: card.term_content_type,
        codeLanguage: card.code_language,
      })),
    );
    if (titleRef.current) titleRef.current.value = set.title;
    if (courseRef.current) courseRef.current.value = set.course;
    if (termLangRef.current)
      termLangRef.current.value = set.global_term_language;
    if (defLangRef.current)
      defLangRef.current.value = set.global_definition_language;
  });

  const validate = (): boolean => {
    const title = titleRef.current?.value?.trim();
    const course = courseRef.current?.value?.trim();
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
    if (mutation.isPending) return;
    if (!validate()) return;

    const body = {
      title: titleRef.current!.value.trim(),
      course: courseRef.current!.value.trim(),
      global_term_language: termLangRef.current!.value,
      global_definition_language: defLangRef.current!.value,
      cardlist: cardArray.map((card, i) => ({
        term: card.term.trim().slice(0, 500),
        definition: card.definition.trim().slice(0, 500),
        number:
          typeof card.index === "number" && !isNaN(card.index) ? card.index : i,
        ...(card.image ? { image: card.image } : {}),
        ...(card.contentType &&
        ["text", "latex", "code"].includes(card.contentType)
          ? { term_content_type: card.contentType }
          : {}),
        ...(card.codeLanguage ? { code_language: card.codeLanguage } : {}),
      })),
    };

    try {
      await mutation.mutateAsync(body);
      router.push(`/studoset/${id}`);
    } catch {
      toast.error(t("submit_error"));
    }
  };

  const addCard = (focus = false) => {
    if (focus) focusAfterAdd.current = true;
    setCardArray((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        index: prev.length,
        term: "",
        definition: "",
        image: "",
        isDouble: false,
        contentType: "text" as const,
        codeLanguage: "typescript",
      },
    ]);
  };

  const handleEnterDefinition = (index: number) => {
    if (index < cardArray.length - 1) {
      getCardRefs(cardArray[index + 1].id).term.current?.focus();
    } else {
      addCard(true);
    }
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
          contentType: "text" as const,
          codeLanguage: "typescript",
        },
        ...prev.slice(index),
      ];
      return updated.map((card, i) => ({ ...card, index: i }));
    });
  };

  const deleteCard = (id: string) => {
    cardRefsMap.current.delete(id);
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

  const updateCard = useCallback(
    (id: string, field: string, value: string | boolean) => {
      setCardArray((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, [field]: value } : card,
        ),
      );
    },
    [],
  );

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

  useKeyboardShortcut("a", () => addCard(true), {
    ctrl: true,
    shift: true,
    always: true,
  });
  useKeyboardShortcut("s", () => handleSubmit(), { ctrl: true, always: true });
  useKeyboardShortcut("backspace", deleteLatestCard, {
    ctrl: true,
    always: true,
  });

  return (
    <>
      <form
        ref={topRef}
        onSubmit={handleSubmit}
        className="w-full scroll-hidden text-studodarkblue dark:text-white h-fit mt-10 md:mt-0 flex text-sm sm:text-base flex-col items-center justify-baseline pt-20 px-10"
        data-cy="studyset_form"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <div className="w-full text-2xl sm:text-3xl flex flex-row gap-2 items-end text-studodarkblue font-bold dark:text-white">
            {t("edit")}
          </div>

          <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
            <div className="flex flex-col gap-1">
              <InputField
                ref={titleRef}
                variant={"cardInput"}
                placeholder={t("title_placeholder")}
                data-cy="title_input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    courseRef.current?.focus();
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                <InputField
                  ref={courseRef}
                  variant={"cardInput"}
                  placeholder={t("course_placeholder")}
                  data-cy="course_input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (cardArray.length > 0) {
                        getCardRefs(cardArray[0].id).term.current?.focus();
                      }
                    }
                  }}
                />
              </div>

              <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                <select
                  ref={folderRef}
                  className="h-10 text-sm px-5 gap-5 text-studodarkblue dark:text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"
                  data-cy="folder_select"
                >
                  <option value="">{t("folder_placeholder")}</option>
                  {folders?.map((item) => (
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

          <div
            ref={ref}
            className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-end mt-4"
          ></div>

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
                contentType={card.contentType}
                codeLanguage={card.codeLanguage}
                isDouble={duplicates.includes(card.id)}
                deleteCard={deleteCard}
                updateCard={updateCard}
                length={cardArray.length}
                insertCard={() => insertCard(index + 1)}
                termRef={getCardRefs(card.id).term}
                defRef={getCardRefs(card.id).def}
                onEnterDefinition={() => handleEnterDefinition(index)}
              />
            ))}
          </div>

          <div className="flex w-full mb-3 sm:mb-4 md:mb-5 group relative">
            <BaseButton
              onClick={() => addCard()}
              type="button"
              className="w-full"
              variant={"approve"}
              data-cy="add_card_button"
              disabled={cardArray.length > 500}
            >
              {t("add_card")}
            </BaseButton>
          </div>

          <div
            ref={bottomRef}
            className="flex w-full mb-6 sm:mb-8 md:mb-10 flex-row justify-end"
          >
            <BaseButton
              type="submit"
              disabled={mutation.isPending}
              variant={"submit"}
              textSize={"sm"}
              data-cy="submit_studyset_top"
              className={"min-w-1/4 max-h-10"}
              label={mutation.isPending ? t("saving") : t("create")}
            />
          </div>
        </div>
        {!inView && (
          <JumpToBottom jumpToTop={jumpToTop} jumpToBottom={jumpToBottom} />
        )}
      </form>
    </>
  );
}
