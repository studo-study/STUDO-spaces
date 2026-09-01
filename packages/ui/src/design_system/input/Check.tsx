import React, { useId } from "react";
import classNames from "@studo/utils/classnames";
import { CheckIcon, Minus } from "lucide-react";

interface CheckProps {
  checked: boolean;
  unCertain?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  activeColor?: string;
}

const Check: React.FC<CheckProps> = (props) => {
  const {
    checked,
    unCertain,
    onChange,
    label,
    disabled,
    className,
    width = 16,
    height = 16,
  } = props;

  const id = useId();

  return (
    <div className="w-fit flex flex-row gap-2 items-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width,
          height,
        }}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className={classNames(
            "appearance-none cursor-pointer relative w-full h-full rounded-[5px] border border-neutral-200/30 hover:border-indigo-500 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            (checked || unCertain) && "bg-indigo-500 border-indigo-500",
          )}
        />

        {unCertain && (
          <span
            style={{
              width,
              height,
            }}
            className="pointer-events-none text-white absolute inset-0 h-full w-full flex items-center justify-center"
          >
            <Minus size={12} strokeWidth={2.7} />
          </span>
        )}
        {checked && (
          <span
            style={{
              width,
              height,
            }}
            className="pointer-events-none text-white absolute inset-0 h-full w-full flex items-center justify-center"
          >
            <CheckIcon size={12} strokeWidth={2.7} />
          </span>
        )}
      </div>

      {label && (
        <label
          htmlFor={id}
          className={classNames(
            "text-studogrey text-sm cursor-pointer",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Check.displayName = "Check";

export default Check;
