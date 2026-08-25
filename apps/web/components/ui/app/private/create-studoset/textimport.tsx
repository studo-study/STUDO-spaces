"use client";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import CheckBox from "@studo/ui/design_system/input/ToggleField";
import { CardData } from "@/types/types";

type ValueSeperator = "komma" | "tab" | "dash";
type LineSeperator = "puntkomma" | "enter";

interface importerProps {
  onClose: () => void;
  cardArray: CardData[];
  setCardArray: Dispatch<SetStateAction<CardData[]>>;
}
export default function Textimport(props: importerProps) {
  const { onClose, cardArray, setCardArray } = props;
  const t = useTranslations("import");
  const [input, setInput] = useState<string>("");
  const [valueSeparator, setValueSeparator] = useState<ValueSeperator>("komma");
  const [lineSeparator, seLineSeparator] = useState<LineSeperator>("puntkomma");

  const toggleValueSeperator = (value: string) => {
    setValueSeparator(value as ValueSeperator);
  };
  const toggleLineSepereator = () => {
    if (lineSeparator === "enter") {
      seLineSeparator("puntkomma");
    } else seLineSeparator("enter");
  };

  const checkSettings = (text: string) => {
    if (text.includes("\t")) setValueSeparator("tab");
    if (text.includes("-")) setValueSeparator("dash");
    else setValueSeparator("komma");
    if (text.includes("\n")) seLineSeparator("enter");
    else if (text.includes(";")) seLineSeparator("puntkomma");
  };

  const parsedCards = useMemo<CardData[]>(() => {
    if (input.trim().length === 0) return [];

    const sep =
      valueSeparator === "komma" ? "," : valueSeparator === "tab" ? "\t" : "-";
    return (lineSeparator === "enter" ? input.split(/\r?\n/) : input.split(";"))
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((card, i) => {
        const idx = card.indexOf(sep);
        const term = idx === -1 ? card.trim() : card.slice(0, idx).trim();
        const definition = idx === -1 ? "" : card.slice(idx + 1).trim();
        return {
          id: crypto.randomUUID(),
          index: cardArray.length + 1 + i,
          term,
          definition,
          image: null,
          isDouble: false,
          contentType: "text" as const,
          codeLanguage: "typescript",
        };
      });
  }, [input, valueSeparator, lineSeparator, cardArray.length]);

  const importCards = () => {
    setCardArray((prev) => {
      const nonEmpty = prev.filter(
        (c) => c.term.trim() !== "" || c.definition.trim() !== "",
      );
      return [...nonEmpty, ...parsedCards];
    });
    setInput("");
    onClose();
  };

  return (
    <div className="w-full h-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <div className={"w-full h-full grid grid-cols-2 gap-10 "}>
        <div className={"w-full h-full flex flex-col gap-5"}>
          <div
            className={
              "w-full h-full overflow-hidden rounded-4xl border border-studoborder"
            }
          >
            <textarea
              placeholder={t("paste_here")}
              onPaste={(e) => checkSettings(e.clipboardData.getData("text"))}
              className="w-full h-full min-h-full dark:text-white resize-none p-5 bg-studogrey/30 scroll-hidden"
              value={input}
              onChange={(e) => {
                setInput?.(e.target.value);
              }}
            ></textarea>
          </div>
          <div>
            <BaseButton
              disabled={parsedCards.length === 0}
              variant={"submit"}
              type={"button"}
              className={"min-w-full"}
              label={t("import")}
              onClick={importCards}
            />
          </div>
        </div>
        <div className={"w-full h-full rounded-4xl"}>
          <div className={"w-full h-1/3"}>
            <span className={"text-xl font-bold"}>
              {t("text_import_title")}
            </span>
            <div className={"flex flex-col gap-5 w-full"}>
              <div className={"flex flex-col gap-3"}>
                <span className={"font-bold opacity-50"}>
                  {t("term_definition_separator")}
                </span>
                <div className={"w-full flex justify-between items-center"}>
                  <span>{t("by_comma")}</span>
                  <CheckBox
                    checked={valueSeparator === "komma"}
                    onChange={() => toggleValueSeperator("komma")}
                  />
                </div>
                <div className={"w-full flex justify-between items-center"}>
                  <span className={""}>{t("by_tab")}</span>
                  <CheckBox
                    checked={valueSeparator === "tab"}
                    onChange={() => toggleValueSeperator("tab")}
                  />
                </div>
                <div className={"w-full flex justify-between items-center"}>
                  <span className={""}>{t("by_dash")}</span>
                  <CheckBox
                    checked={valueSeparator === "dash"}
                    onChange={() => toggleValueSeperator("dash")}
                  />
                </div>
              </div>
              <hr className={"border-studogrey/30 my-3"} />
              <div className={"flex flex-col gap-3"}>
                <span className={"font-bold opacity-50"}>
                  {t("card_separator")}
                </span>
                <div className={"w-full flex justify-between items-center"}>
                  <span>{t("by_semicolon")}</span>
                  <CheckBox
                    checked={lineSeparator === "puntkomma"}
                    onChange={toggleLineSepereator}
                  />
                </div>
                <div className={"w-full flex justify-between items-center"}>
                  <span>{t("by_newline")}</span>
                  <CheckBox
                    checked={lineSeparator === "enter"}
                    onChange={toggleLineSepereator}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
