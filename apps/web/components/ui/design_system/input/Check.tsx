import React, { useId } from "react";
import classNames from "@/utils/classnames";
import { CheckIcon } from "lucide-react";

interface CheckProps {
  checked: boolean;
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
            "appearance-none cursor-pointer relative w-full h-full rounded-sm border border-studoborder/30 hover:border-studoblue transition-colors duration-300 checked:border-studoblue checked:bg-studoblue disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        />

        {checked && (
          <span
            style={{
              width,
              height,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full flex items-center justify-center"
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
