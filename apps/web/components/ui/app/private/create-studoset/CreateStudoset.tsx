"use client";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCreateStudyset } from "@/hooks/app/sets/useCreateStudoset";
import SetImporter from "@/components/ui/app/private/create-studoset/SetImporter";
import CardItem from "@/components/ui/app/private/create-studoset/CardItem";
import Sortable from "sortablejs";
import ImportButton from "@/components/ui/app/private/create-studoset/importButton";
import { useRouter } from "@/i18n/routing";
import { CardData } from "@/types/types";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import { useToast } from "@/components/providers/app/ToastProvider";
import InputField from "@/components/ui/design_system/input/InputField";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useCourses } from "@/hooks/app/courses/useCourses";
import JumpToBottom from "./JumpToBottom";
import { useInView } from "react-intersection-observer";
import { SuggestionImage } from "@studo/types";
import InputSelect from "@/components/ui/design_system/select/InputSelect";
import ComboBox from "@/components/ui/design_system/select/ComboBox";
import CreateCourse from "@/components/ui/app/private/create-studoset/CreateCourse";
import CourseAdd from "@/components/ui/app/private/course/layout/AddPopup";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
];

const DRAFT_KEY = "create-studoset-draft";

type Draft = {
  title: string;
  flowcourseId: string;
  termLang: string;
  defLang: string;
  cardArray: CardData[];
};

const firstCard = (): CardData => ({
  id: crypto.randomUUID(),
  index: 0,
  term: "",
  definition: "",
  image: null,
  isDouble: false,
  contentType: "text" as const,
  codeLanguage: "typescript",
});

export default function CreateStudosetForm() {
  const t = useTranslations("createstudoset");
  const [showImporter, setShowImporter] = useState(false);
  const router = useRouter();
  const mutation = useCreateStudyset();
  const toast = useToast();
  const { data: flowcourses = [] } = useCourses();
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

  const savedDraft = (): Draft | null => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [hasDraft, setHasDraft] = useState(false);
  const [cardArray, setCardArray] = useState<CardData[]>([firstCard()]);

  const [flowcourseId, setFlowcourseId] = useState<string>("");
  const [termLang, setTermLang] = useState<string>("");
  const [defLang, setDefLang] = useState<string>("");
  const titleRef = useRef<HTMLInputElement>(null);
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

  const getCardRefs = (id: string) => {
    if (!cardRefsMap.current.has(id)) {
      cardRefsMap.current.set(id, {
        term: React.createRef<HTMLInputElement>(),
        def: React.createRef<HTMLInputElement>(),
      });
    }
    return cardRefsMap.current.get(id)!;
  };

  const saveDraft = () => {
    const d: Draft = {
      title: titleRef.current?.value ?? "",
      flowcourseId: flowcourseId,
      termLang,
      defLang,
      cardArray,
    };
    const hasContent =
      d.title.trim() !== "" ||
      d.cardArray.some(
        (c) => c.term.trim() !== "" || c.definition.trim() !== "",
      );
    if (hasContent) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
      setHasDraft(true);
    }
  };

  // Restore draft from localStorage on mount (client-only)
  useEffect(() => {
    const d = savedDraft();
    if (!d) return;
    setHasDraft(true);
    if (d.cardArray.length > 0) setCardArray(d.cardArray);
    if (titleRef.current) titleRef.current.value = d.title;
    if (d.flowcourseId) setFlowcourseId(d.flowcourseId);
    setTermLang(d.termLang);
    setDefLang(d.defLang);
  }, []);

  // Save draft whenever cardArray changes; focus new card after add
  useEffect(() => {
    saveDraft();
    if (focusAfterAdd.current && cardArray.length > 0) {
      focusAfterAdd.current = false;
      const lastCard = cardArray[cardArray.length - 1];
      getCardRefs(lastCard.id).term.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardArray]);

  const deleteDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setCardArray([firstCard()]);
    if (titleRef.current) titleRef.current.value = "";
    setFlowcourseId("");
    setTermLang("");
    setDefLang("");
  };
  const validate = (): boolean => {
    const title = titleRef.current?.value?.trim();

    if (!title) {
      toast.error(t("title_error"));
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
      globalTermLanguage: termLang,
      globalDefinitionLanguage: defLang,
      ...(flowcourseId ? { flowcourseId: flowcourseId } : {}),
      cardlist: cardArray.map((card, i) => ({
        term: card.term.trim().slice(0, 500),
        definition: card.definition.trim().slice(0, 500),
        number:
          typeof card.index === "number" && !isNaN(card.index) ? card.index : i,
        ...(card.image ? { suggestionImageId: card.image.id } : {}),
        ...(card.contentType &&
        ["text", "latex", "code"].includes(card.contentType)
          ? { termContentType: card.contentType }
          : {}),
        ...(card.codeLanguage ? { codeLanguage: card.codeLanguage } : {}),
      })),
    };

    try {
      const data = await mutation.mutateAsync(body);
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      router.push(`/studoset/${data.id}`);
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
        image: null,
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
          image: null,
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
    (
      id: string,
      field: string,
      value: string | boolean | SuggestionImage | null,
    ) => {
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

  useKeyboardShortcut("i", () => setShowImporter((p) => !p), {
    ctrl: true,
    always: true,
  });
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
          if (
            event.key === "Enter" &&
            (event.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            event.preventDefault();
          }
        }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <div className="w-full text-2xl sm:text-3xl flex flex-row gap-2 items-end text-studodarkblue font-bold dark:text-white">
            {t("title")}
            <span className={"text-lg opacity-50"}>
              {hasDraft && t("draft")}
            </span>
          </div>

          <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
            <div className="flex flex-col gap-1">
              <InputField
                ref={titleRef}
                variant={"cardInput"}
                placeholder={t("title_placeholder")}
                data-cy="title_input"
                onChange={saveDraft}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full gap-1 flex flex-col h-fit">
                <ComboBox
                  title={t("course_placeholder")}
                  options={flowcourses.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                  createButton={<CreateCourse />}
                  value={flowcourseId}
                  onChange={(value) => {
                    setFlowcourseId(String(value));
                    saveDraft();
                  }}
                  dataCy="course_input"
                  size="lg"
                  tabIndex={-1}
                  searchable
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
              <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                <InputSelect
                  title={t("select_language_term")}
                  options={[
                    { value: "", label: t("term_language") },
                    ...LANGUAGES.map((lang) => ({
                      value: lang.code,
                      label: lang.name,
                    })),
                  ]}
                  value={termLang}
                  onChange={(value) => {
                    setTermLang(String(value));
                    saveDraft();
                  }}
                  dataCy="term_language_select"
                  size="lg"
                  tabIndex={-1}
                />
              </div>

              <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                <InputSelect
                  title={t("select_language_def")}
                  options={[
                    { value: "", label: t("def_language") },
                    ...LANGUAGES.map((lang) => ({
                      value: lang.code,
                      label: lang.name,
                    })),
                  ]}
                  value={defLang}
                  onChange={(value) => {
                    setDefLang(String(value));
                    saveDraft();
                  }}
                  dataCy="definition_language_select"
                  size="lg"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          <div
            ref={ref}
            className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-end mt-4"
          >
            <ImportButton setShowImporter={setShowImporter} />
            <div className={"w-fit flex flex-row gap-2 items-center"}>
              {hasDraft && (
                <BaseButton
                  title={t("delete_draft")}
                  type="button"
                  disabled={mutation.isPending}
                  variant={"danger"}
                  textSize={"sm"}
                  data-cy="submit_studyset_top"
                  className={"max-h-10"}
                  onClick={deleteDraft}
                  label={t("delete_draft")}
                />
              )}
            </div>
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
                contentType={card.contentType}
                codeLanguage={card.codeLanguage}
                isDouble={duplicates.includes(card.id)}
                deleteCard={deleteCard}
                updateCard={updateCard}
                length={cardArray.length}
                insertCard={() => insertCard(index + 1)}
                termRef={getCardRefs(card.id).term}
                defRef={getCardRefs(card.id).def}
                image={card.image}
                onEnterDefinition={() => handleEnterDefinition(index)}
                onShiftTabTerm={() => {
                  if (index > 0) {
                    getCardRefs(cardArray[index - 1].id).def.current?.focus();
                  }
                }}
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
