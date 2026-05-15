import { useState, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function Importer({ onClose, onImport }) {
  const { t } = useTranslation();
  const [rawInput, setRawInput] = useState("");
  const [termSeparator, setTermSeparator] = useState("tab");
  const [cardSeparator, setCardSeparator] = useState("newline");

  const handleChange = useCallback((e) => {
    const text = e.target.value;
    setRawInput(text);

    if (text.includes("\t")) {
      setTermSeparator("tab");
    } else if (text.includes(",")) {
      setTermSeparator("comma");
    }
    if (text.includes("\n")) {
      setCardSeparator("newline");
    } else if (text.includes(";")) {
      setCardSeparator("semicolon");
    }
  }, []);

  const handleImport = useCallback(() => {
    const splitDuo = termSeparator === "tab" ? "\t" : ",";
    const splitPairs = cardSeparator === "newline" ? "\n" : ";";

    const pairs = rawInput.split(splitPairs);
    const cards = [];

    pairs.forEach((pair) => {
      const parts = pair.split(splitDuo);
      if (parts.length >= 2) {
        cards.push({
          term: parts[0]?.trim() || "",
          definition: parts[1]?.trim() || "",
          url: parts[2]?.trim() || "",
        });
      }
    });

    if (cards.length > 0) {
      onImport(cards);
    }
  }, [rawInput, termSeparator, cardSeparator, onImport]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const newValue =
          rawInput.substring(0, start) + "\t" + rawInput.substring(end);
        setRawInput(newValue);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 1;
        }, 0);
      }
    },
    [rawInput],
  );

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center z-[9999]
      bg-blue-50 dark:bg-bg-dark px-4 sm:px-6 md:px-10 py-4 sm:py-5"
    >
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5">
        <IoClose
          size={28}
          onClick={onClose}
          className="cursor-pointer text-gray-700 dark:text-white hover:text-gray-500 sm:w-[35px] sm:h-[35px]"
        />
      </div>

      <div className="w-full h-full flex flex-col gap-3 sm:gap-4 md:gap-5 pt-12 sm:pt-15">
        <span className="font-atrament text-2xl sm:text-3xl font-semibold text-studodarkblue dark:text-white">
          {t("import").toUpperCase()}:
        </span>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 overflow-hidden">
          <div className="h-64 lg:h-full">
            <textarea
              value={rawInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl
                text-sm sm:text-base border-0 resize-none
                bg-studowhite/20 shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0
                text-studodarkblue dark:text-white"
              placeholder={t("Paste your terms here...")}
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-5 overflow-y-auto">
            <div className="flex flex-col gap-2 sm:gap-3">
              <span className="font-bold text-base sm:text-lg md:text-xl text-studodarkblue dark:text-white">
                {t("Between term and definition")}:
              </span>

              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="termSeparator"
                  checked={termSeparator === "tab"}
                  onChange={() => setTermSeparator("tab")}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-studoblue"
                />
                <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
                  Tab
                </span>
              </label>

              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="termSeparator"
                  checked={termSeparator === "comma"}
                  onChange={() => setTermSeparator("comma")}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-studoblue"
                />
                <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
                  Comma
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <span className="font-bold text-base sm:text-lg md:text-xl text-studodarkblue dark:text-white">
                {t("Between cards")}:
              </span>

              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="cardSeparator"
                  checked={cardSeparator === "newline"}
                  onChange={() => setCardSeparator("newline")}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-studoblue"
                />
                <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
                  New Line
                </span>
              </label>

              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="cardSeparator"
                  checked={cardSeparator === "semicolon"}
                  onChange={() => setCardSeparator("semicolon")}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-studoblue"
                />
                <span className="text-sm sm:text-base text-studodarkblue dark:text-white">
                  Semicolon
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full flex h-fit items-center justify-center py-3 sm:py-4">
          <button
            type="button"
            onClick={handleImport}
            className="inline-flex flex-row items-center justify-center p-2 sm:p-3
              font-atrament font-bold text-base sm:text-lg md:text-xl text-[#2a3a42]
              w-full sm:w-2/3 md:w-1/2 lg:w-1/3
              rounded-full bg-studoblue cursor-pointer select-none
              border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:text-white"
          >
            {t("import").toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
