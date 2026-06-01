"use client";
import { Ref } from "react";

interface SpeedyInputProps {
  correct: boolean;
  incorrect: boolean;
  inputRef: Ref<HTMLInputElement>;
  disabled: boolean;
  checkInput: () => void;
  termMode: boolean;
}

const SpeedyInput = ({
  correct,
  incorrect,
  inputRef,
  disabled,
  checkInput,
  termMode,
}: SpeedyInputProps) => {
  return (
    <div
      className={`bg-gray-300/20 min-h-12 dark:bg-studogrey/20 px-5 flex items-center w-full rounded-3xl w-full h-fit py-2 border ${
        correct
          ? "border-emerald-400"
          : incorrect
            ? "border-rose-600"
            : "border-transparent focus-within:border-gray-300 focus-within:dark:border-studoborder/30"
      }`}
    >
      <input
        ref={inputRef}
        disabled={disabled} // ← React beheert dit nu
        autoFocus={true}
        onKeyDown={(e) => e.key === "Enter" && !disabled && checkInput()}
        type="text"
        placeholder={termMode ? `typ definitie` : `typ term`}
        className={"w-full group h-full outline-none"}
      />
    </div>
  );
};

SpeedyInput.displayName = "SpeedyInput";
export default SpeedyInput;
