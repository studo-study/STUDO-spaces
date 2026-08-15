import classNames from "@studo/utils/classnames";
import { ReactNode } from "react";

interface IButtonRowItem extends Omit<
  React.HTMLProps<HTMLButtonElement>,
  "size" | "type"
> {
  label?: string;
  onSubmit?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  error?: string;
  icon?: ReactNode;
  className?: string;
}

interface ITextRow extends Omit<
  React.HTMLProps<HTMLSpanElement>,
  "size" | "type"
> {
  label?: string;
  type: "text_row";
  currentPage?: number;
  numPages?: number;
}

interface ButtonRowProps {
  buttons: (IButtonRowItem | ITextRow)[];
}

const ButtonRow: React.FC<ButtonRowProps> = (props) => {
  const { buttons } = props;

  return (
    <div
      className={classNames(
        "dark:text-white rounded-full border border-studoborder/30 flex flex-row gap-2 p-1.5 bg-studogrey/30",
      )}
    >
      {buttons.map((btn, index) => {
        if (btn.type === "text_row") {
          return (
            <span
              key={index}
              className={"text-sm flex items-center gap-2 justify-center"}
            >
              <span
                className={"min-w-5 flex justify-end items-center font-medium"}
              >
                {btn.currentPage}
              </span>
              /<span className={"min-w-5 font-medium"}>{btn.numPages}</span>
            </span>
          );
        } else {
          return (
            <button
              key={(btn.label ?? "") + index}
              className={classNames(
                "cursor-pointer w-7 h-7 rounded-full flex items-center justify-center border transition-transform active:scale-95 duration-300 border-studoborder/30 bg-studogrey/30",
                btn.className,
                btn.disabled && "opacity-50 cursor-not-allowed",
              )}
              type={btn.type}
              disabled={btn.disabled || btn.isLoading}
              onClick={btn.onClick}
              style={{ width: btn.width as string | number | undefined }}
              {...btn}
            >
              {btn.icon}
              {btn.isLoading ? "laden..." : btn.label}
              {btn.children}
            </button>
          );
        }
      })}
    </div>
  );
};

ButtonRow.displayName = "ButtonRow";
export default ButtonRow;
