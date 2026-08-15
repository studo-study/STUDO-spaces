import React, { useId } from "react";
import classNames from "@studo/utils/classnames";

export interface ISwitchToggleProps {
  id?: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  isDisabled?: boolean;
  tabIndex?: number;
  size?: 4 | 5 | 6;
}

export const SwitchToggle: React.FC<ISwitchToggleProps> = (props) => {
  const {
    id: _id,
    onChange,
    isChecked,
    isDisabled,
    tabIndex,
    size = 5,
  } = props;
  const generatedId = useId();

  const id = _id || generatedId;
  return (
    <label
      htmlFor={id}
      className={classNames("inline-block", {
        "cursor-pointer": !isDisabled,
        "cursor-not-allowed": isDisabled,
      })}
    >
      <input
        id={id}
        type="checkbox"
        className="hidden"
        onChange={(evt) => onChange(evt.target.checked)}
        checked={isChecked}
        disabled={isDisabled}
        tabIndex={tabIndex}
      />

      <div
        className={classNames(
          "relative rounded-full transition-colors duration-300 ease-in-out",
          {
            "w-8 h-4": size === 4,
            "w-10 h-5": size === 5,
            "w-12 h-6": size === 6,
            "bg-emerald-400 dark:bg-studoblue": isChecked && !isDisabled,
            "bg-emerald-400/30 dark:bg-studoblue/30": isChecked && isDisabled,
            "bg-neutral-300": !isChecked,
          },
        )}
      >
        <div
          className={classNames(
            "absolute left-0.5 top-0.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out",
            {
              "w-3 h-3": size === 4,
              "translate-x-4": size === 4 && isChecked,
              "w-4 h-4": size === 5,
              "translate-x-5": size === 5 && isChecked,
              "w-5 h-5": size === 6,
              "translate-x-6": size === 6 && isChecked,
            },
          )}
        />
      </div>
    </label>
  );
};
