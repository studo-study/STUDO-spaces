import classNames from "@/utils/classnames";
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

interface ButtonRowProps {
  buttons: IButtonRowItem[];
}

const ButtonRow: React.FC<ButtonRowProps> = (props) => {
  const { buttons } = props;

  return (
    <div
      className={classNames(
        "dark:text-white rounded-full border border-studoborder/30 flex flex-row gap-2 p-1.5 bg-studogrey/30",
      )}
    >
      {buttons.map((btn, index) => (
        <button
          key={(btn.label ?? "") + index}
          className={classNames(
            "cursor-pointer w-7 h-7 rounded-full flex items-center justify-center border transition-transform active:scale-95 duration-300 border-studoborder/30 bg-studogrey/30",
            btn.className,
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
      ))}
    </div>
  );
};

ButtonRow.displayName = "ButtonRow";
export default ButtonRow;
